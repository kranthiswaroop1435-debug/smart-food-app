from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from supabase import create_client, Client
import os
import uuid
import bcrypt
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Smart Food API")

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Initialize Supabase client if credentials are provided
if SUPABASE_URL and SUPABASE_KEY:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
else:
    supabase = None
    print("Warning: SUPABASE_URL or SUPABASE_KEY is missing. Database operations will fail.")

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

# --- Pydantic Models ---

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    password: str

class OrderItemReq(BaseModel):
    food_name: str
    price: float
    quantity: int

class OrderRequest(BaseModel):
    user_id: str
    full_name: str
    phone_number: str
    delivery_address: str
    delivery_notes: Optional[str] = ""
    total_amount: float
    items: List[OrderItemReq]

# --- API Endpoints ---

@app.post("/api/register")
async def register(req: RegisterRequest):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database connection not configured")
    try:
        # Check if user already exists
        res = supabase.table("users").select("*").eq("email", req.email).execute()
        if res.data and len(res.data) > 0:
            raise HTTPException(status_code=400, detail="User already exists")
            
        new_user = {
            "id": str(uuid.uuid4()),
            "email": req.email,
            "password_hash": hash_password(req.password)
        }
        insert_res = supabase.table("users").insert(new_user).execute()
        if insert_res.data:
            return {"status": "success", "user": insert_res.data[0]}
        raise HTTPException(status_code=400, detail="Failed to create user")
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/login")
async def login(req: LoginRequest):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database connection not configured")
    try:
        # Check if user exists
        res = supabase.table("users").select("*").eq("email", req.email).execute()
        if res.data and len(res.data) > 0:
            user = res.data[0]
            if verify_password(req.password, user["password_hash"]):
                return {"status": "success", "user": user, "session": "mock-session-token"}
            else:
                raise HTTPException(status_code=400, detail="Invalid login credentials")
        else:
            raise HTTPException(status_code=400, detail="User not found")
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/orders")
async def create_order(order: OrderRequest):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database connection not configured")
    try:
        order_id = str(uuid.uuid4())
        
        # Insert order
        order_data = {
            "id": order_id,
            "user_id": order.user_id,
            "full_name": order.full_name,
            "phone_number": order.phone_number,
            "delivery_address": order.delivery_address,
            "delivery_notes": order.delivery_notes,
            "total_amount": order.total_amount
        }
        supabase.table("orders").insert(order_data).execute()
        
        # Insert items
        items_data = []
        for item in order.items:
            items_data.append({
                "id": str(uuid.uuid4()),
                "order_id": order_id,
                "food_name": item.food_name,
                "price": item.price,
                "quantity": item.quantity
            })
        
        if items_data:
            supabase.table("order_items").insert(items_data).execute()
            
        return {"status": "success", "order_id": order_id, "message": "Order placed successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/orders/{user_id}")
async def get_orders(user_id: str):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database connection not configured")
    try:
        # Fetch orders for user
        orders_res = supabase.table("orders").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        orders = orders_res.data
        
        # Fetch items for these orders
        if orders:
            order_ids = [o["id"] for o in orders]
            items_res = supabase.table("order_items").select("*").in_("order_id", order_ids).execute()
            items = items_res.data
            
            # Map items to orders
            for order in orders:
                order["items"] = [item for item in items if item["order_id"] == order["id"]]
                
        return {"status": "success", "data": orders}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "db_connected": supabase is not None}
