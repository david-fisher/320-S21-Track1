class Cache:
    def __init__(self):
        self.obj = {}
    
    def get(self, key):
        return self.obj[key] if key in self.obj else None
    
    def put(self, key, v):
        self.obj[key] = v