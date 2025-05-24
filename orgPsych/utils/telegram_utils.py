import requests

BOT_TOKEN = '7805155435:AAE0HeHX03d933t5x8VpQ8szCncoO3_jGVE'
CHAT_ID = '537426115'

def send_telegram_message(message):
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    data = {
        'chat_id': CHAT_ID,
        'text': message,
        'parse_mode': 'HTML',
    }
    response = requests.post(url, data=data)
    print('Telegram API response status:', response.status_code)
    print('Telegram API response body:', response.text)
    return response.ok
