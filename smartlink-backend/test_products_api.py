import requests

BASE_URL = "http://localhost:5000/api"

def test_add_product():
    # 1. Login to get token
    login_data = {"email": "testuser_new@example.com", "password": "password123"}
    login_res = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    if login_res.status_code != 200:
        print("Login failed:", login_res.text)
        return
    
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Add product
    product_data = {
        "name": "Script Product",
        "price": "29.99",
        "description": "Added via script",
        "file_url": "http://example.com/file"
    }
    add_res = requests.post(f"{BASE_URL}/products", json=product_data, headers=headers)
    print("Add Product Status:", add_res.status_code)
    print("Add Product Response:", add_res.text)
    
    # 3. Get products
    get_res = requests.get(f"{BASE_URL}/products", headers=headers)
    print("Get Products Status:", get_res.status_code)
    print("Get Products Count:", len(get_res.json()))

if __name__ == "__main__":
    test_add_product()
