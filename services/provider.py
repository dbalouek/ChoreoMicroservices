class ItemsProvider(object):
    def __init__(self, items: list=[]):
        self._items = items
        

    def get(self, number_of_items: int=5) -> list:
        if not self._items:
            return []
        
        if number_of_items > len(self._items):
            number_of_items = len(self._items)
            
        return self._items[0:number_of_items]

    def put(self, item):
        exists = item in self._items
        if exists:
            return 201
        else:
            self._items.append(item)