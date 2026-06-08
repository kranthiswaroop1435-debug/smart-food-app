from dotenv import load_dotenv
import os

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SECRET_KEY = os.getenv("SECRET_KEY")

# Safety check - warn if any variable is missing
if not SUPABASE_URL:
    raise ValueError("SUPABASE_URL is not set in .env file")
if not SUPABASE_KEY:
    raise ValueError("SUPABASE_KEY is not set in .env file")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY is not set in .env file")
