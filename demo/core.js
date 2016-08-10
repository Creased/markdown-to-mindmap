/*!
 * Author: Baptiste MOINE <contact@bmoine.fr>
 * Project: Markdown to MindMap
 * Homepage: https://github.com/Creased/markdown-to-mindmap
 * Released: 03/08/2016
 */

// Ajoute ou supprime les classes HTML à un objet du DOM
function switchOver(obj, bool, attr, val) {
    attr = attr || "disabled";
    val = val || attr;
    $.each(obj, function(i, v) {
        if (bool) {
            $(v[0]).attr(attr, val);
        } else {
            $(v[0]).removeAttr(attr);
        }
    });
    return false;
}

$("#convert").on({
    click: function () {
        // Conversion d'une table des matières simple en MarkDown (liste non ordonnée), en MindMap respectant le schéma XML de FreeMind
        $().convertTOCtoMM({
            input:  $("#input"),  // Sélecteur du champs de saisie de la table des matière
            output: $("#output")  // Sélecteur du champs de sortie pour la génération de la structure XML
        });

        // Activation d'un bouton pour le téléchargement du Blob
        switchOver([$("#download")], false);
    }
});

$("#download").on({
    click: function () {
        // Conversion d'une table des matières simple en MarkDown (liste non ordonnée), en MindMap respectant le schéma XML de FreeMind
        var xml = $("#output"),
            filename = "mindmap.mm";

        saveAs(
            new Blob([xml.text()], {type: "text/plain;charset=" + document.characterSet}),
            filename
        );
    }
});
