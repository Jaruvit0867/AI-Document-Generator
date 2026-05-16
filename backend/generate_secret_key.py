"""
Generate a secure secret key for JWT tokens
Run this script and copy the output to your .env file
"""
import secrets

# Generate a secure random secret key
secret_key = secrets.token_urlsafe(32)

print("=" * 60)
print("Generated SECRET_KEY for your .env file:")
print("=" * 60)
print(secret_key)
print("=" * 60)
print("\nCopy this value and update SECRET_KEY in your .env file")
print("Example:")
print(f"SECRET_KEY={secret_key}")

# Made with Bob
