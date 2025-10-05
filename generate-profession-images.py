#!/usr/bin/env python3
"""
Script pour générer les images de métiers en adaptant l'image de base
avec les vêtements et accessoires appropriés pour chaque profession.
"""

import os
import json
from PIL import Image, ImageDraw, ImageFont
import requests
from io import BytesIO

# Liste des 30 métiers identifiés
PROFESSIONS = [
    "medecin", "psychologue", "nutritionniste", "kinesitherapeute", 
    "pharmacien", "orthophoniste", "dentiste", "infirmier", 
    "optometriste", "ergotherapeute", "physiotherapeute", "audiologiste", 
    "chiropraticien", "massotherapeute", "naturopathe", "technologue_medical",
    "avocat", "notaire", "comptable", "dev_fullstack", "designer_ux", 
    "architecte", "electricien", "entrepreneur", "consultant", 
    "agent_immobilier", "educatrice_specialisee", "psychoeducatrice", 
    "enseignante_prescolaire", "enseignante_secondaire"
]

# Configuration des vêtements et accessoires pour chaque métier
PROFESSION_CONFIG = {
    "medecin": {
        "clothes": "blouse_blanche",
        "accessories": ["stethoscope", "badge_medical"],
        "colors": {"top": "white", "accent": "blue"}
    },
    "psychologue": {
        "clothes": "chemise_professionnelle",
        "accessories": ["lunettes", "carnet_notes"],
        "colors": {"top": "light_blue", "accent": "navy"}
    },
    "nutritionniste": {
        "clothes": "blouse_blanche",
        "accessories": ["lunettes", "balance_nutrition"],
        "colors": {"top": "white", "accent": "green"}
    },
    "kinesitherapeute": {
        "clothes": "polo_sportif",
        "accessories": ["badge_medical", "gants"],
        "colors": {"top": "light_blue", "accent": "white"}
    },
    "pharmacien": {
        "clothes": "blouse_blanche",
        "accessories": ["lunettes", "mortier_pilule"],
        "colors": {"top": "white", "accent": "green"}
    },
    "orthophoniste": {
        "clothes": "chemise_professionnelle",
        "accessories": ["lunettes", "livre_communication"],
        "colors": {"top": "light_pink", "accent": "purple"}
    },
    "dentiste": {
        "clothes": "blouse_blanche",
        "accessories": ["masque_medical", "loupe_dentaire"],
        "colors": {"top": "white", "accent": "blue"}
    },
    "infirmier": {
        "clothes": "uniforme_medical",
        "accessories": ["stethoscope", "badge_medical"],
        "colors": {"top": "white", "accent": "blue"}
    },
    "optometriste": {
        "clothes": "blouse_blanche",
        "accessories": ["lunettes", "loupe_optique"],
        "colors": {"top": "white", "accent": "blue"}
    },
    "ergotherapeute": {
        "clothes": "polo_professionnel",
        "accessories": ["lunettes", "outils_adaptation"],
        "colors": {"top": "light_green", "accent": "navy"}
    },
    "physiotherapeute": {
        "clothes": "polo_sportif",
        "accessories": ["badge_medical", "gants"],
        "colors": {"top": "light_blue", "accent": "white"}
    },
    "audiologiste": {
        "clothes": "blouse_blanche",
        "accessories": ["lunettes", "casque_audio"],
        "colors": {"top": "white", "accent": "blue"}
    },
    "chiropraticien": {
        "clothes": "chemise_professionnelle",
        "accessories": ["lunettes", "table_ajustement"],
        "colors": {"top": "white", "accent": "navy"}
    },
    "massotherapeute": {
        "clothes": "polo_confortable",
        "accessories": ["lunettes", "huiles_massage"],
        "colors": {"top": "light_green", "accent": "brown"}
    },
    "naturopathe": {
        "clothes": "chemise_naturelle",
        "accessories": ["lunettes", "plantes_medicinales"],
        "colors": {"top": "beige", "accent": "green"}
    },
    "technologue_medical": {
        "clothes": "blouse_blanche",
        "accessories": ["lunettes", "equipement_labo"],
        "colors": {"top": "white", "accent": "blue"}
    },
    "avocat": {
        "clothes": "costume_professionnel",
        "accessories": ["lunettes", "toge_avocat"],
        "colors": {"top": "navy", "accent": "white"}
    },
    "notaire": {
        "clothes": "costume_professionnel",
        "accessories": ["lunettes", "sceau_notaire"],
        "colors": {"top": "navy", "accent": "gold"}
    },
    "comptable": {
        "clothes": "costume_professionnel",
        "accessories": ["lunettes", "calculatrice"],
        "colors": {"top": "navy", "accent": "green"}
    },
    "dev_fullstack": {
        "clothes": "polo_tech",
        "accessories": ["lunettes", "laptop"],
        "colors": {"top": "dark_blue", "accent": "green"}
    },
    "designer_ux": {
        "clothes": "chemise_creative",
        "accessories": ["lunettes", "tablette_graphique"],
        "colors": {"top": "black", "accent": "purple"}
    },
    "architecte": {
        "clothes": "chemise_professionnelle",
        "accessories": ["lunettes", "plan_architecture"],
        "colors": {"top": "white", "accent": "navy"}
    },
    "electricien": {
        "clothes": "uniforme_travail",
        "accessories": ["casque_securite", "outils_electriques"],
        "colors": {"top": "orange", "accent": "yellow"}
    },
    "entrepreneur": {
        "clothes": "costume_professionnel",
        "accessories": ["lunettes", "telephone"],
        "colors": {"top": "navy", "accent": "red"}
    },
    "consultant": {
        "clothes": "costume_professionnel",
        "accessories": ["lunettes", "presentation"],
        "colors": {"top": "navy", "accent": "blue"}
    },
    "agent_immobilier": {
        "clothes": "costume_professionnel",
        "accessories": ["lunettes", "cles_maison"],
        "colors": {"top": "navy", "accent": "gold"}
    },
    "educatrice_specialisee": {
        "clothes": "chemise_confortable",
        "accessories": ["lunettes", "materiel_educatif"],
        "colors": {"top": "light_blue", "accent": "yellow"}
    },
    "psychoeducatrice": {
        "clothes": "chemise_professionnelle",
        "accessories": ["lunettes", "jeux_therapeutiques"],
        "colors": {"top": "light_green", "accent": "purple"}
    },
    "enseignante_prescolaire": {
        "clothes": "chemise_colorée",
        "accessories": ["lunettes", "livres_enfants"],
        "colors": {"top": "light_pink", "accent": "yellow"}
    },
    "enseignante_secondaire": {
        "clothes": "chemise_professionnelle",
        "accessories": ["lunettes", "livres_cours"],
        "colors": {"top": "light_blue", "accent": "navy"}
    }
}

def create_profession_image(profession_key, base_image_path, output_dir):
    """
    Crée une image de profession en adaptant l'image de base
    avec les vêtements et accessoires appropriés.
    """
    try:
        # Charger l'image de base
        base_image = Image.open(base_image_path)
        base_image = base_image.convert("RGBA")
        
        # Créer une nouvelle image avec les modifications
        modified_image = base_image.copy()
        draw = ImageDraw.Draw(modified_image)
        
        # Obtenir la configuration pour cette profession
        config = PROFESSION_CONFIG.get(profession_key, {})
        
        # Appliquer les modifications selon la profession
        if profession_key in ["medecin", "dentiste", "infirmier", "optometriste", "technologue_medical"]:
            # Blouse blanche pour les professions médicales
            draw.rectangle([50, 100, 200, 300], fill=(255, 255, 255, 200))
            
        elif profession_key in ["avocat", "notaire", "comptable", "entrepreneur", "consultant", "agent_immobilier"]:
            # Costume professionnel
            draw.rectangle([50, 100, 200, 300], fill=(25, 25, 112, 200))  # Navy blue
            
        elif profession_key in ["dev_fullstack", "designer_ux"]:
            # Vêtements tech
            color = (0, 0, 139) if profession_key == "dev_fullstack" else (0, 0, 0)
            draw.rectangle([50, 100, 200, 300], fill=(*color, 200))
            
        elif profession_key == "electricien":
            # Uniforme de travail orange
            draw.rectangle([50, 100, 200, 300], fill=(255, 165, 0, 200))
            
        else:
            # Chemise professionnelle colorée
            colors = {
                "psychologue": (173, 216, 230),  # Light blue
                "nutritionniste": (255, 255, 255),  # White
                "kinesitherapeute": (173, 216, 230),  # Light blue
                "pharmacien": (255, 255, 255),  # White
                "orthophoniste": (255, 182, 193),  # Light pink
                "ergotherapeute": (144, 238, 144),  # Light green
                "physiotherapeute": (173, 216, 230),  # Light blue
                "audiologiste": (255, 255, 255),  # White
                "chiropraticien": (255, 255, 255),  # White
                "massotherapeute": (144, 238, 144),  # Light green
                "naturopathe": (245, 245, 220),  # Beige
                "architecte": (255, 255, 255),  # White
                "educatrice_specialisee": (173, 216, 230),  # Light blue
                "psychoeducatrice": (144, 238, 144),  # Light green
                "enseignante_prescolaire": (255, 182, 193),  # Light pink
                "enseignante_secondaire": (173, 216, 230),  # Light blue
            }
            color = colors.get(profession_key, (255, 255, 255))
            draw.rectangle([50, 100, 200, 300], fill=(*color, 200))
        
        # Ajouter des accessoires selon la profession
        if "lunettes" in config.get("accessories", []):
            # Dessiner des lunettes
            draw.ellipse([80, 80, 120, 100], outline=(0, 0, 0), width=2)
            draw.ellipse([130, 80, 170, 100], outline=(0, 0, 0), width=2)
            draw.line([120, 90, 130, 90], fill=(0, 0, 0), width=2)
        
        if "stethoscope" in config.get("accessories", []):
            # Dessiner un stéthoscope
            draw.ellipse([60, 120, 80, 140], outline=(0, 0, 0), width=2)
            draw.line([70, 140, 70, 180], fill=(0, 0, 0), width=2)
            draw.line([70, 180, 90, 180], fill=(0, 0, 0), width=2)
            draw.line([90, 180, 90, 200], fill=(0, 0, 0), width=2)
        
        if "casque_securite" in config.get("accessories", []):
            # Dessiner un casque de sécurité
            draw.arc([70, 60, 180, 120], 0, 180, fill=(255, 255, 0), width=5)
        
        # Sauvegarder l'image modifiée
        output_path = os.path.join(output_dir, f"{profession_key}.png")
        modified_image.save(output_path, "PNG")
        print(f"Image créée: {output_path}")
        
        return output_path
        
    except Exception as e:
        print(f"Erreur lors de la création de l'image pour {profession_key}: {e}")
        return None

def main():
    """Fonction principale pour générer toutes les images de métiers."""
    
    # Créer le dossier de sortie
    output_dir = "images/professions"
    os.makedirs(output_dir, exist_ok=True)
    
    # Chemin vers l'image de base (l'image fournie par l'utilisateur)
    base_image_path = "images/emma-avatar.jpg"  # Ajuster selon le nom du fichier
    
    if not os.path.exists(base_image_path):
        print(f"Image de base non trouvée: {base_image_path}")
        return
    
    print(f"Génération des images de métiers...")
    print(f"Image de base: {base_image_path}")
    print(f"Dossier de sortie: {output_dir}")
    print(f"Nombre de métiers: {len(PROFESSIONS)}")
    
    # Générer les images pour chaque métier
    created_images = []
    for profession in PROFESSIONS:
        image_path = create_profession_image(profession, base_image_path, output_dir)
        if image_path:
            created_images.append({
                "profession": profession,
                "image_path": image_path,
                "config": PROFESSION_CONFIG.get(profession, {})
            })
    
    # Sauvegarder la liste des images créées
    with open("profession-images-list.json", "w", encoding="utf-8") as f:
        json.dump(created_images, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ {len(created_images)} images de métiers créées avec succès!")
    print(f"Liste sauvegardée dans: profession-images-list.json")

if __name__ == "__main__":
    main()

