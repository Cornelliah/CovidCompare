# 🦠 CovidCompare

**CovidCompare** est une application interactive développée en **React** qui permet de visualiser et de comparer les statistiques du COVID-19 entre différents pays en temps réel.

L'objectif de ce projet est de manipuler des données complexes provenant d'une API REST et de les restituer sous forme de graphiques clairs et de cartes d'informations.

---

## 🚀 Fonctionnalités

* **Sélection dynamique :** Choix de plusieux pays via un menu déroulant avec recherche et affichage des drapeaux.
* **Statistiques en temps réel :** Affichage des cas totaux, décès, guérisons et cas actifs.
* **Comparaison visuelle :**
    * 📊 **Graphique en barres :** Pour comparer les volumes globaux (Cas vs Décès vs Guérisons).
    * 📈 **Graphique linéaire :** Pour analyser la tendance des 30 derniers jours (historique).
* **Indicateurs quotidiens :** Affichage des nouveaux cas et décès enregistrés "aujourd'hui".
* **Mise à jour :** Affichage de la date de la dernière mise à jour des données.

---

## 🛠️ Stack Technique

* **Frontend :** React.js (Hooks: `useState`, `useEffect`)
* **Build Tool :** Vite
* **Graphiques :** Chart.js & react-chartjs-2
* **UI Components :** React-Select (pour le menu déroulant)
* **Styles :** CSS3 (Grid & Flexbox), Design responsive
* **API :** [disease.sh](https://disease.sh/) (Open Disease Data API)

---

## ⚙️ Installation et Démarrage

Pour lancer le projet localement sur votre machine :

1.  **Cloner le dépôt :**
    ```bash
    git clone https://github.com/Cornelliah/CovidCompare.git
    cd CovidCompare
    ```

2.  **Installer les dépendances :**
    ```bash
    npm install
    ```

3.  **Lancer le serveur de développement :**
    ```bash
    npm run dev
    ```

4.  **Accéder à l'application :**
    Ouvrez votre navigateur sur `http://localhost:5173` (ou le port indiqué dans votre terminal).

---

## 📂 Structure du Projet

```text
src/
├── components/
│   ├── ComparisonChart.jsx  # Graphique comparatif (Barres)
│   ├── CountrySelector.jsx  # Dropdown de sélection des pays
│   ├── CountryStats.jsx     # Cartes d'informations détaillées
│   └── HistoryChart.jsx     # Graphique d'historique (Lignes)
├── services/
│   └── CovidAPI.js          # Gestion des appels API (fetch, endpoints)
├── App.jsx                  # Logique principale et assemblage
└── main.jsx                 # Point d'entrée React

5.  ## Nom et prenom des membres :

    Tchinda loic
    Horiane Hounkanrin
    Yvan Seukou
    ANANI KOFFI JEAN-YVES