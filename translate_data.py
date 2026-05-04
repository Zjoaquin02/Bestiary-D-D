import os
import json
import urllib.request
import urllib.parse
import time

DATA_DIR = 'data'
TRANSLATIONS_FILE = os.path.join(DATA_DIR, 'translations_en.json')
LIST_FILE = os.path.join(DATA_DIR, 'list.json')

def translate_text(text):
    if not text or not isinstance(text, str):
        return text
    
    # Avoid translating single short words that shouldn't be translated or are already english
    if text.lower() in ["boss", "monster"]:
        return text
        
    try:
        url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=en&dt=t&q=" + urllib.parse.quote(text)
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            res = json.loads(response.read().decode('utf-8'))
            # Combine all translated sentences
            translated = "".join([sentence[0] for sentence in res[0]])
            return translated
    except Exception as e:
        print(f"Error translating '{text[:20]}...': {e}")
        return text

def process_all():
    print("Iniciando traducción automática del bestiario...")
    
    if os.path.exists(TRANSLATIONS_FILE):
        with open(TRANSLATIONS_FILE, 'r', encoding='utf-8') as f:
            translations = json.load(f)
    else:
        translations = {}

    # Read list.json
    try:
        with open(LIST_FILE, 'r', encoding='utf-8') as f:
            creatures_list = json.load(f)
    except:
        print("Error: No se encontró list.json")
        return

    # Fields to translate
    fields_to_translate = [
        'nombre', 'tipo', 'categoria', 'habitat', 'vulnerable', 
        'resistente', 'supervivencia', 'habilidad_titulo', 'habilidad', 'lore'
    ]

    total = len(creatures_list)
    for i, c in enumerate(creatures_list):
        c_id = c['id']
        print(f"[{i+1}/{total}] Procesando: {c_id}")
        
        # Skip if already translated (to allow continuing if it fails or stops)
        if c_id in translations and 'lore' in translations[c_id] and translations[c_id]['lore'] != "":
            print(f"  -> Ya traducido. Saltando.")
            continue
            
        file_path = os.path.join(DATA_DIR, f"{c_id}.json")
        if not os.path.exists(file_path):
            print(f"  -> Archivo no encontrado: {file_path}")
            continue
            
        with open(file_path, 'r', encoding='utf-8') as f:
            c_data = json.load(f)
            
        tr_data = {}
        
        # Base fields
        for field in fields_to_translate:
            if field in c_data and c_data[field]:
                tr_data[field] = translate_text(c_data[field])
                
        # Variants
        if c_data.get('is_multi') and 'variantes' in c_data:
            tr_data['variantes'] = []
            for var in c_data['variantes']:
                var_tr = {}
                for field in fields_to_translate:
                    if field in var and var[field]:
                        var_tr[field] = translate_text(var[field])
                tr_data['variantes'].append(var_tr)
                
        translations[c_id] = tr_data
        
        # Save progress every creature in case it crashes
        with open(TRANSLATIONS_FILE, 'w', encoding='utf-8') as f:
            json.dump(translations, f, indent=2, ensure_ascii=False)
            
        # Be nice to the API
        time.sleep(1)

    print("¡Traducción completa! Revisa data/translations_en.json")

if __name__ == '__main__':
    process_all()
