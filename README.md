GGRrrrr
=======

A Symfony project created on August 4, 2016, 12:56 pm.

Développé lors du Hackaton n°3 (4/8-5/8) WCS Chartres par Dorian Walck et Thomas Javanaud.
Les sources initiales des deux modules de jeu :
https://github.com/webdevbrian/whereami
https://github.com/nhfruchter/geoguessr-generator

Ces deux modules ont été débuggés et portés sur Symfony 2.8.

Développement des fonctionnalités suivantes lors du hackaton :
- connexion utilisateur
- interfaçage pour créer un challenge en 5 rounds
- interfaçage pour jouer aux différents challenges
- noter un challenge
- voir les scores des différents gamers pour chaque challenge


Installation d'assetic nécessaire
composer require symfony/assetic-bundle

Pour pousser vers web les assets du dossier Bundle/Resources/public
php app/console assets:install web --symlink

Pour avoir le rendu en prod il faut exporter en dur les assets
php app/console assetic:dump --env=prod
C'est une action ponctuelle à réaliser à chaque modification des assets