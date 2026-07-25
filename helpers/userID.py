import random
import string
from helpers.checkUser import checkUserID



def generateUserId(provider_id):
    userId = checkUserID(provider_id)

    if userId is None:
        characters = string.ascii_uppercase + string.digits
        return "".join(random.choices(characters, k=10))

