Crée une application web moderne appelée "MS – REATD", destinée aux étudiants de la communauté REATD – UVCI (Représentation des Étudiants en E-Administration et Transformation Digitale).

Objectif : Permettre aux étudiants de calculer automatiquement leurs moyennes ECUE, UE et semestre selon le système LMD, avec un design moderne et académique.

---

### Fonctionnalités principales :

1. Calcul moyenne ECUE
- Champ dynamique pour ajouter plusieurs notes de devoir
- Champ note d’examen
- Formule exacte utilisée : 
  Moyenne ECUE = (Moyenne devoirs × 0,4) + (Note examen × 0,6)
  - Moyenne devoirs = somme des notes de devoir ÷ nombre de devoirs
- Affichage instantané du résultat arrondi à deux décimales

2. Calcul moyenne UE
- Ajout de plusieurs ECUE
- Pondération par crédits
- Calcul automatique de la moyenne UE

3. Calcul moyenne semestre
- Moyenne générale du semestre
- Statut automatique : Admis, Ajourné, Rattrapage

4. Tableau récapitulatif
- Historique des résultats
- Export PDF ou impression

5. Mode sombre / clair
6. Responsive mobile / tablette
7. Sauvegarde locale des données (LocalStorage)

---

### Identité visuelle

- Palette de couleurs :
  - Violet profond / fuchsia (principal) : #9B2C9B
  - Vert moderne (accent) : #0E8F5A
  - Blanc (fond / contraste) : #FFFFFF

- Logo :
  - Texte principal : "MS" en lettres capitales, épais
  - Sous-titre : "– REATD" en police fine, élégant
  - Icône optionnelle : diplôme ou graphique digital, couleur vert ou blanc

- Polices :
  - MS : Poppins Bold / Inter Bold / Montserrat ExtraBold
  - – REATD : Poppins Medium / Inter Medium / Roboto Regular
  - Texte du site / boutons / labels : Poppins / Inter / Roboto

- Style :
  - Minimaliste, moderne, digital
  - Cartes avec ombre légère pour sections et boutons
  - Icônes fines, interface claire et professionnelle
  - Fond blanc, boutons et cartes violet avec touches de vert
  - Interface épurée, académique et inspirant confiance

---

### UX/UI

- Menu latéral ou top bar avec navigation claire : ECUE / UE / Semestre / Historique
- Sections principales avec cartes interactives
- Résultats dynamiques en temps réel selon la formule : Moyenne ECUE = (Moyenne devoirs × 0,4) + (Note examen × 0,6)
- Boutons visibles et responsive
- Mobile-first design