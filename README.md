<table align="center"><tr><td align="center" width="9999">
<img src="https://i.imgur.com/xQxCGjE.png" align="center" width="150" alt="Logo du projet"><br>
Logiciel de surveillance par Webcam
</td></tr></table>

# Table des matières 

- [A propos](#a-propos)
  - [Outils utilisés](#outils-utilisés)
- [Remarques](#remarques)
- [Journal de bord](#journal-de-bord)
- [Planning](https://prnt.sc/snhd3a)

# A propos

*NetMonitor* est une application développée en JavaScript utilisant le framework ElectronJS
C'est essentiellement une interface pour le logiciel Nmap, habituellement exécuté via une console
ou terminal.
*NetMonitor* permet :
- de scanner une adresse IP ou un nom de domaine avec un profil de scan choisi par l'utilisateur
- de scanner le réseau local de la machine sur laquelle l'application est utilisée
- d'afficher les résultats du scan et de les exporter dans un fichier texte
- d'effectuer un *traceroute* sur une adresse IP ou nom de domaine et de voir les différents
sauts réalisés par le programme sur une carte du monde

**Cette application a été développée dans le cadre du travail pratique individuel (TPI).**

## Outils utilisés

Mon but est de construire cette application avec les outils suivants :
* [ElectronJS](https://www.electronjs.org/)
* [NodeJS](https://nodejs.org/en/)
* [Nmap](https://nmap.org/)
* [Le package node-nmap](https://www.npmjs.com/package/node-nmap)
* [Bootstrap pour l'UI](https://getbootstrap.com/)

ElectronJS est un framework JavaScript permettant aux développeurs de créer des applications
cross-platform pour ordinateur. Chaque application est packagée avec Chromium (pour le rendu visuel),
V8 (moteur JS de Google écrit en C++) et Node.js.

Le package que j'ai choisi pour interfacer avec Nmap est *node-nmap*. Bien qu'il n'ait pas été mis à jour depuis 3 ans,
après l'avoir testé, il fonctionne encore parfaitement bien. Il me permettra d'effectuer des scans facilement et en me retournant des résultats
précis.

Bootstrap est utilisé pour tout ce qui est interfaces de mon application. Bien que cette dernière ait une taille fixe,
je me suis efforcé de construire une interface qui serait techniquement responsive, en utilisant les composants mis à disposition par Bootstrap.

# Remarques

Aucune pour le moment.

# Journal de bord

**25.05.2020**

*  Prise de connaissance de l'énoncé pour le TPI.

*  Création d'un projet sur GitHub.

*  Lecture complète de l'énoncé et prise de connaissance des tâches (cahier des charges). 
   - **Scan IP ou nom de domaine** : l'application doit permettre à l'utilisateur de scanner une adresse IP ou un nom de domaine
        en utilisant un profil de scan, ou laisser l'utilisateur rentrer des arguments particuliers.
   - **Scan du réseau local** : l'application doit pouvoir scanner la plage IP du réseau local de la machine et afficher les appareils détectés.
   - **Traceroute** : l'application doit permettre à l'utilisateur d'effectuer un traceroute sur une adresse IP ou un nom de domaine.
        Les sauts doivent être affichés sur une carte du monde, ainsi que dans un tableau répertoriant le N° du saut, l'IP source et l'IP de destination.

* A discuter avec les experts / prof
    - **Scan IP ou nom de domaine** : profil de scan **personnalisé**
      - Compte-tenu du fait que l'utilisateur peut sélectionner des arguments spéciaux, est-ce qu'il ne serait pas utile de rajouter
      une option pour voir l'output "brut" d'Nmap ?
----
