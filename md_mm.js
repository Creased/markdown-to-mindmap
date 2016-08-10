/*!
 * Author: Baptiste MOINE <contact@bmoine.fr>
 * Project: Markdown to MindMap
 * Homepage: https://github.com/Creased/markdown-to-mindmap
 * Released: 03/08/2016
 */

jQuery.fn.convertTOCtoMM = function(options){
    // Paramètres
    var params = jQuery.extend({
        input:  $("#input"),  // Sélecteur du champs de saisie de la table des matière
        output: $("#output")  // Sélecteur du champs de sortie pour la génération de la structure XML
    }, options);

    $(function(){
        // Nettoie le contenu du tableau de la valeur deleteValue
        Array.prototype.clean = function(deleteValue) {
            deleteValue = deleteValue || "";
            for (var i = 0; i < this.length; i++) {
                if (this[i] == deleteValue) {
                    this.splice(i, 1);
                    i--;
                }
            }
            return this;
        };

        // Compte le nombre d'apparition du pattern p dans la chaîne s
        function count(s, p) {
            var m = s.match(p);
            if ($.isEmptyObject(m)) {
                c = 0;
            } else {
                c = m.length;
            }
            return c;
        }

        if (params.input instanceof Object && params.output instanceof Object && params.input.length !== 0 && params.output.length !== 0) {
            if (params.input.val() != '') {
                var lines = params.input.val().split('\n').clean(''),  // Tableau contenant toutes les lignes du champs de saisi
                    template = {"id": 0, "xml": "", "prevlevel": 0, "level": 0, "nextlevel": 0},  // Template pour chacune des lignes
                    elem,  // Template appliqué à la ligne actuelle
                    elems = [],  // Tableau prêt à recevoir les lignes traitées et insérées dans le template
                    line,  // Référence à une ligne sélectionnée dans le tableau lines
                    level,  // Niveau de tabulation de la ligne sélectionnée
                    prevlevel,  // Niveau de tabulation de la ligne précédente
                    position = '',  // Position du noeud sur la carte (i.e. droite ou gauche)
                    nextlevel;  // Niveau de tabulation de la ligne suivante

                for (var i = 0; i < lines.length; i++) {
                    prevlevel = level || 0;
                    line = lines[i];  // Sélection d'une ligne dans le tableau

                    // Récupération du nombre du niveau d'indentation de ligne actuelle
                    level = line.split('-').clean('')[0];  // Récupération de la partie correspondant à l'indentation (c-à-d précédent le '-')
                    level = count(level, /\t/g);  // Comptage du nombre de tabulation

                    if (i+1 != lines.length) {
                        nextlevel = lines[i+1];
                        nextlevel = nextlevel.split('-').clean('')[0];
                        nextlevel = count(nextlevel, /\t/g);
                    } else {
                        nextlevel = 0;
                    }

                    // Ajout des données relatives à la ligne actuelle
                    elem = $.extend( true, {}, template );  // Copie du template pour la ligne actuelle (note: un simple elem = template créer une nouvelle référence pour l'objet template, mais ne le clône pas...)
                    elem.id = i;  // Index du noeud dans tout le corps (note: utilisé pour la fermeture des balises restantes)
                    elem.xml = line.replace(/^(\t*)?\-\s(\w+|\W+|.+)(\s*|\t*)$/, '$1<node TEXT="$2">');  // XML correspondant au noeud de la MindMap
                    elem.xml = elem.xml.replace(/\[([^\]]+)\]\(([^\)]+)\)/, '$1" LINK="$2');  // Ajoute, s'il existe, un lien au noeud

                    // Ajout la position du noeud sur la carte
                    if (level == 1) {
                        if (position == 'left' || position == '') {
                            position = 'right';
                        } else {
                            position = 'left';
                        }
                        elem.xml = elem.xml.replace(/node TEXT/, 'node POSITION="' + position + '" TEXT');
                    }

                    elem.prevlevel = prevlevel;  // Niveau du noeud précédent
                    elem.level = level;  // Niveau du noeud actuel
                    elem.nextlevel = nextlevel;  // Niveau du noeud suivant

                    // On ferme la balise si on a atteint le closepoint définit par :
                    //   - Un saut vers une ligne dont le niveau est inférieur à celui de la ligne actuelle
                    //   - Un saut vers une ligne dont le niveau est égal à la ligne actuelle
                    // c-à-d quand aucun noeud restant ne sera dans ce noeud
                    if ( (level == nextlevel) || (level > nextlevel) ) {
                        elem.xml = elem.xml + '</node>';
                    }

                    // Fermeture des balises restantes
                    if ( ((level - 2) == nextlevel) || ((level - 1) == nextlevel) || (nextlevel == 0) ) {
                        for (var j = level; j > nextlevel; j--) {
                            elem.xml = elem.xml + '\r\n' + Array(j+1).join('\t') + '</node>';
                        }
                    }

                    // Debug
                    // console.log({"prevlevel": elem.prevlevel, "level": elem.level, "nextlevel": elem.nextlevel, "xml": elem.xml});

                    // Initialisation de la ligne actuelle dans le tableau des éléments
                    if (typeof(elems[i]) === 'undefined') {
                        elems[i] = elem;
                    }
                }

                // var maxlevel = Math.max.apply(  // Recherche du niveau maximal dans le tableau des éléments
                //     Math, elems.map(
                //         function(o){
                //             return o.level;
                //         }
                //     )
                // );

                // Dump du HTML
                var html = '<map version="1.0.1">';  // Ouverture du document XML et de la MindMap
                for (var i = 0; i < elems.length; i++) {
                    html += '\r\n\t' + elems[i].xml;  // Ajout du noeud au corps du document XML
                }
                html += '\r\n</map>';  // Fermeture du document XML et de la MindMap
                params.output.text(html);
            } else {
                alert("Aucune valeur dans le champs de saisie n'a pu être traitée !");
            }
        } else {
            alert("Le champs de saisie ou de sortie n'existe pas !");
        }
    });
};
