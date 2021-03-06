<table align="center"><tr><td align="center" width="9999">
<img src="https://i.imgur.com/xQxCGjE.png" align="center" width="150" alt="Logo du projet"><br>
Logiciel de découverte réseau avec Nmap
</td></tr></table>

# Table des matières 

- [A propos](#a-propos)
  - [Outils utilisés](#outils-utilisés)
  - [Outils utilisés pour la documentation](#outils-utilisés-pour-la-documentation)
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

**PS: Cette application intègre la version (portable) 7.80 du logiciel Nmap, qui est publié sous licence GNU GPL 2.0 (modifiée),
qui me permet de redistribuer une copie dudit logiciel.** La licence est accessible [ici](nmap-7.80/COPYING)

## Outils utilisés

Mon but est de construire cette application avec les outils suivants :
* [ElectronJS](https://www.electronjs.org/)
* [NodeJS](https://nodejs.org/en/)
* [Nmap](https://nmap.org/)
* [Ma version du package node-nmap](https://github.com/Stacced/node-nmap/)
* [Bootstrap pour l'UI](https://getbootstrap.com/)

ElectronJS est un framework JavaScript permettant aux développeurs de créer des applications
cross-platform pour ordinateur. Chaque application est packagée avec Chromium (pour le rendu visuel),
V8 (moteur JS de Google écrit en C++) et Node.js.

Le package que j'ai choisi pour interfacer avec Nmap est *node-nmap*. Bien qu'il n'ait pas été mis à jour depuis 3 ans,
après l'avoir testé, il fonctionne encore parfaitement bien. Il me permettra d'effectuer des scans facilement et en me retournant des résultats précis.

**Mise à jour 28.05 pour node-nmap**
Après avoir découvert quelques *caveats* à node-nmap, j'ai décidé de tout simplement fork la librairie pour y apporter mes propres modifications (disponibles sur le dépot de la lib, voir plus haut pour le lien). J'en ferais peut-être un projet plus concret dans le futur.

Bootstrap est utilisé pour tout ce qui est interfaces de mon application. Bien que cette dernière ait une taille fixe,
je me suis efforcé de construire une interface qui serait techniquement responsive, en utilisant les composants mis à disposition par Bootstrap.

## Outils utilisés pour la documentation
* Planning : [Google Sheets](https://www.docs.google.com/sheets)
* Environnement de développement : [PhpStorm](https://jetbrains.com/phpstorm)
* Documentation technique et manuel d'utilisateur : [Word](https://office.com)

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
**26.05.2020**

* Récap du travail de la veille

* Avancement de la documentation technique
  - Chapitre méthodologie
  - Rédaction du product backlog
  - Structure du projet (dossiers)
  - Fichiers de code (app.js, renderer.js, preload.js)

* Recherches
  - Utilisation d'Electron Forge pour gérer le démarrage et le packaging de l'app Electron (https://www.electronforge.io/)
  - Pour l'UI, Bootstrap sera utilisé avec jQuery

* Avancement de l'appli
  - Setup boilerplate avec Electron Forge
    - Permet de gérer les scripts de démarrage et de packaging plus simplement (yarn run start, yarn run make, etc)
  - Paramétrage de l'interface
    - Taille (1050x580)
    - Pas de "frame" autour de l'appli, puisqu'on a un frame customisé
    - No resize de la fenêtre
    - No maximize
  - Ajout de Bootstrap et jQuery via leurs CDN respectifs
  - Ajout de la barre de navigation
    - Lien vers la page d'accueil NetMonitor
    - Lien vers la page scan par IP ou nom de domaine
    - Lien vers la page scan du réseau local
  - Ajout de la page d'accueil
    - Bouton scan par IP ou nom de domaine
    - Bouton scan du réseau local
----
**27.05.2020**
 * Récap du travail de la veille
 
 * Création de la page scan par IP
  - A faire:
    - Champ IP/NDD
    - Champ profil de scan
    - Champ arguments (pour le profil personnalisé)
    - Bouton lancer le scan
    - Bouton annuler
    
 * Préparation des autres pages pour plus tard
  - On peut désormais switch entre les différentes pages via la barre de navigation et par les boutons de la page d'accueil
 
 * Petit problème d'UI rencontré sur le champ profil
  - On voit un outline orange sur les options. Après quelques recherches, cela vient certainement des paramètres d'accessibilité de Chrome. Après quelques recherches et essais, impossible de l'enlever...
  
 * UI de la page scan par IP terminé
 
 * Première version du "vrai" scan
  - Cela a pris plus de temps que prévu, je n'ai donc pas pu accorder beaucoup de temps à la page des résultats. On fera ça demain.
  - J'utilise la librairie [node-nmap](https://www.npmjs.com/package/node-nmap) pour interfacer avec NMAP. L'objectif est de ship l'application avec l'exécutable d'NMAP pour éviter à l'utilisateur d'avoir à l'installer.
  
----
**28.05.2020**
  * Récap du travail de la veille
  
  * Après quelques analyses de la librairie `node-nmap`, il s'avère que les résultats que je reçois sont "pauvres". En effet, ils sont parsés à partir de la sortie XML d'NMAP, puis transformés en JSON, et encore par dessus ceci la librairie fait un traitement particulier. C'est extrêmement problématique car cela restreint énormément les infos renvoyées, même avec un profil de scan intensif. De plus, la librairie est configurée de telle manière qu'elle ne permet l'output des données qu'en XML ! Très embêttant également. De ce fait, il va falloir :
    - Changer de parseur XML pour quelque chose de plus performant => Mon choix s'est porté sur [xml2json](https://www.npmjs.com/package/xml2json)
    - Désactiver l'output XML forcé
  
  * Utilisation de mon fork de node-nmap ! Dispo [ici](https://github.com/Stacced/node-nmap/)
    - Plus d'output XML forcé
    - Parseur plus performant
    - Quelques fix par ci par là
    - Futur projet ?
  
  * Discussion avec Monsieur Aliprandi concernant l'affichage des résultats
    - Du fait que l'utilisateur peut sélectionner un profil de scan spécial, il y a forcément des résultats différents en fonction des profils. Que faire dans ce cas ?
      - **Solution 1:** dynamiser la page des résultats en fonction des champs (fastidieux et enclin à des erreurs / valeurs non existantes)
      - **Solution 2:** afficher simplement l'output brut d'NMAP
    - Après avoir demandé à Monsieur Aliprandi, il me valide la **deuxième solution**

  * UI de la page résultats finie
    - Affichage de l'output d'NMAP
    - Bouton Traceroute (pas encore fonctionnel)
    - Bouton Exporter les résultats
    - Bouton Fermer les résultats
  
  * Ecran de chargement
    - Ajout d'un bouton Annuler le scan
    
  * Export des résultats
    - L'utilisateur peut choisir un fichier texte dans lequel sauvegarder les résultats
    - Notification si opération réussie ou non
----
**29.05.2020**
  * Récap du travail de la veille
  
  * Dans les résultats de scan, j'ai remarqué que les accents n'étaient pas bien formattés. Après quelques recherches, il s'avère que c'est un problème inhérent à NMAP. A moins de trouver une solution de mon coté, ça ne sera pas fix.
  
  * UI de la page résultats scan réseau local presque finie
    - Affichage de la plage IP scannée
    - Affichage du nombre de machines détectées
    - Manque affichage des machines (sera fait demain)
  
  * Backend du scan réseau local fini
    - Il ne reste plus qu'à lier le backend à l'UI
    
  * Avancement doc technique
    - Analyse organique
  
  * Tests
----
**01.06.2020**
  * Congé (Pentecôte)
----
**02.06.2020**
  * Récap du travail du 29.05
  
  * Affichage des machines détectées sur la page résultats scan réseau local
    - Icône de l'OS détecté
    - Nom de domaine local
    - Cliquer sur une machine redirige l'utilisateur sur la page scan IP et remplit automatiquement le champ adresse IP avec l'IP de la machine sélectionnée
  
  * Quelques modifications sur la page résultats scan réseau local
    - Désormais, cliquer sur "Scan réseau local" dans la barre de navigation ne redémarrera pas un scan automatiquement. L'utilisateur devra cliquer sur le bouton "Relancer le scan" sur la page des résultats.
  
  * Documentation technique
    - Finalisation de la partie analyse organique
    
  * Tests
----
**03.06.2020**
  * Récap du travail du 02.06
  
  * Traceroute
    - Recherches préliminaires
      - [NodeJS-Traceroute](https://www.npmjs.com/package/nodejs-traceroute) sera utilisé pour le traceroute en lui-même
      - [Leaflet](https://leafletjs.com/) sera utilisé pour l'affichage de la carte du monde avec OpenStreetMaps pour les tiles
      ![Croquis interface](https://i.imgur.com/zdhMvJI.png)
  
  * UI Traceroute
    - Leaflet m'a posé quelques soucis, notamment parce qu'il fallait refresh la taille de son conteneur pour que les tiles s'affichent proprement
      - Solutionné avec map.invalidateSize()
    - L'interface est quasiment terminée, il reste quelques petites choses par-ci par-là
  
  * Ajout validation des champs pour la page scan par IP
    - Utilisation de la librairie [validator](https://www.npmjs.com/package/validator)
    
  * Fix de plusieurs bugs et typos
  
  * Documentation technique
    - Avancement partie analyse organique
  
  * Tests
----
**04.06.2020**
  * Récap du travail du 03.06

  * Discussions avec Monsieur Aliprandi concernant la fonctionnalité traceroute
    - Au vu du potentiel de ce traceroute, ne serait-il pas judicieux d'en faire une fonctionnalité à part entière ?
    En effet, à l'heure actuelle, le traceroute n'est accessible que quand l'utilisateur a fini de scanner au préalable 
    une adresse IP ou nom de domaine.
    - Réponse : **Oui !** Je vais donc rajouter une page *Traceroute* dans la navbar ainsi que sur l'écran d'accueil.
    L'interface ne change presque pas, si ce n'est un champ IP au dessus de la table des sauts, comme ceci ![UI Traceroute](https://i.imgur.com/7s9rzDm.png) 
  
  * Backend Traceroute
    - Utilisation de la librairie [NodeJS-Traceroute](https://www.npmjs.com/package/nodejs-traceroute)
    - Utilisation de l'API [HTTP de NodeJS](https://nodejs.org/api/http.html)
    - J'ai réutilisé le même principe de fonctionnement que pour le scan par IP et le scan réseau local
      - Le script [preload.js](src/js/preload.js) expose au [renderer.js](src/js/renderer.js) une multitude de fonctions, via l'objet [contextBridge](https://www.electronjs.org/docs/api/context-bridge) d'Electron.
      Ce pont permet, de manière sécurisée, d'exposer des variables, fonctions, objets, au côté client de l'application. Pour ce faire, lors de la compilation, le contextBridge va ajouter
      une "API" à l'objet [window](https://developer.mozilla.org/fr/docs/Web/API/Window). Ceci fait, le renderer aura accès auxdites fonctions et variables en passant par `window`. De cette manière, les appels à des fonctionnalités ou librairies
      se font dans la quasi-totalité via le `main process` d'Electron (le fichier [app.js](src/app.js)), ce qui rend le tout extrêmement sécurisé et très peu enclin à des potentielles failles. Pour le traceroute, c'est exactement
      ce qui a été fait. Le `renderer process` appelle la fonction `startTraceroute`, définie par le `contextBridge`, avec l'IP à utiliser. Ladite fonction va simplement émettre un évènement `startTraceroute` au `main process`.
      Une fois l'évènement reçu côté `main`, le traceroute est lancé de manière asynchrone pour ne pas bloquer l'application. A chaque réception d'un nouveau saut réussi, le `main process` émet un évènement `receivedHopData`, et le transmet
      au `renderer process`. Au préalable, ce dernier aura configuré un callback, également via le `contextBridge`, qui sera appelé à la réception de l'évènement.
      Bien que paraissant compliqué à l'écrit, c'est une réalité un système très bien implémenté, d'une part par Electron et d'une part par moi-même. J'ai conçu l'application avec l'aspect sécurité en tête, pour contrer
      le plus de potentiels vecteurs d'attaques possible.
    
  * Documentation technique
    - Analyse organique terminée, il ne me reste plus qu'à faire l'analyse fonctionnelle et la conclusion (plus de tests aussi ?)
    
  * Tests
----
**05.06.2020**
  * Récap du travail de la veille
  
  * Traceroute
    - Implémentation de la fonction stop (qui n'est pas implémentée de base dans *NodeJS-Traceroute*
      - La librairie émet un évènement `pid` avec l'ID du processus quand ce dernier est lancé. Du coup, je sauvegarde simplement le PID dans une variable globale, puis dès que le `main process` reçoit un évènement `stopTraceroute`, j'appelle `process.kill(pid)` pour terminer le processus. Cela fonctionne très bien !
    - Rework du reset des résultats
      - Nettoyage du layerGroup contenant les sauts et le tracé entre les sauts
      - Nettoyage du contenu de la table des sauts
    - Fix event `done` appelé quand le processus était kill (ce qui était inutile)
    - Fix overflow de la table s'il y a beaucoup de sauts
      - J'utilise la classe `table-sm` de Bootstrap pour réduire le padding des cellules
  
  * Désactivation de la navigation si une opération est en cours (scan, traceroute)
  
  * Documentation technique
    - Analyse fonctionnelle
    - Monsieur Aliprandi m'a confirmé quelques points sur lesquels je n'étais pas sûr de moi.
    
  * Manuel utilisateur
    - Début de la rédaction
  
  * Tests
----
**08.06.2020**
  * Récap du travail du 05.06
  
  * Finalisation du code, fix de quelques bugs
    - L'IP de la machine sélectionnée à partir du scan réseau local n'était pas synchronisée dans le champ arguments du scan IP
    - Ajout du choix traceroute sur la page d'accueil
    - Affichage des erreurs pendant un scan
    - Redirection de l'utilisateur sur la page d'accueil si le scan time-out / échoue / a un problème
    - Fix zoom lors du premier traceroute
  
  * Une grosse partie de la journée a été dédiée à la rédaction de la documentation technique
    - Finalisation de la conclusion (difficultés rencontrées, solutions, améliorations possibles, bilan personnel)
    - Finalisation de l'analyse organique (ajout d'IP-API)
    - Finalisation de l'analyse fonctionnelle
    - Finalisation des tests

  * Manuel utilisateur
    - Ajout de la procédure d'installation
**09.06.2020**
  * Fin du travail aujourd'hui
  
  * Documentation techniques
    - Finitions
  
  * Manuel utilisateur
    - Ajout de l'utilisation + finitions
  
  * Résumé du rapport TPI