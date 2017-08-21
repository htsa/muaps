import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './request.route';

export class RequestController {



  /*@ngInject*/
  constructor($http, $scope, socket, Upload, $rootScope) {
    this.$scope = $scope;
    this.$http = $http;
    this.socket = socket;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.Upload = Upload;
    this.awesomeChoice = [];
    this.choice = {};
    this.student = {};
    this.models = {
    };
    this.request = []; // requete.
    this.awesomeStudent = [];
    this.nameFile = this.$rootScope.file_name;
    this.$rootScope.file_name = this.nameFile;
    this.models_second = {
    };
    $scope.model = this.models_second;

    $scope.data = {
      student: this.awesomeStudent,
      choice: this.awesomeChoice,
      liste_gauche: this.models,
      liste_droite: this.models_second,
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  }

  $onInit() {

    if (this.$rootScope.file_name != undefined) {
      this.Charger();
      this.nameFileOut = this.$rootScope.file_name.split(".json");
      this.nameFileOut = this.nameFileOut[0];
    }
    else {
      this.nameFile = "exemple3.json";
      this.Charger();

    }
  }

  deplier(etat) {

    var elems = document.getElementsByClassName("open/close");

    if (etat == "close") {
      for (var i = 0; i < elems.length; i++) {
        elems[i].removeAttribute("checked");
      }
    }
    else {
      for (var i = 0; i < elems.length; i++) {
        elems[i].removeAttribute("checked");
        elems[i].setAttribute("checked", "checked");
      }
    }
  }

  selectAllStudent(etat) {




    if (etat == "select") { // si on decide de selectionner les etudiants
      for (var person in this.awesomeStudent) {
        this.awesomeStudent[person]["select"] = true;
      }

    }
    else { // si on decide de deselectionner les étudiants 
      for (var person in this.awesomeStudent) {
        this.awesomeStudent[person]["select"] = false;
      }
    }
  }


  addFile() {

    if (/json$/.test(this.file.name)) {
      this.nameFile = this.file.name;
      this.Upload.upload({
        url: 'api/things/upload',
        data: { file: this.file }
      }).then(this.ChargerVersion());
    }
    else {
      alert("ce n'est pas un fichier json");
    }
  }

  Charger() {
    if (!/json$/.test(this.nameFile)) {
      this.nameFile = this.nameFile + ".json";
    }
    this.$rootScope.file_name = this.nameFile;
    this.$http.get('./storage/' + this.nameFile)
      .then(res => {
        this.choice = {};
        this.awesomeStudent = [];
        this.student = {};
        console.log(this.awesomeStudent);
        console.log("ici");

        if (res.data.version == 1) {
          this.ChargerVersion();
          console.log("version");
        }
        else {
          this.ChargerFichier();
          console.log("fichier");
        }
      });
  }

  changement = function (item) {
    console.log("changement");
    console.log(item);
    if (item.type == "1") {
      item.type = "2";
      item.name = "serieux";
      console.log("on part d un 1");
      console.log(item);
      console.log("putain");
    }
    else {
      item.type = "1";
      console.log("on part d un 2");
    }
  };

  ChargerFichierbis() {
    if (!/json$/.test(this.nameFile)) {
      this.nameFile = this.nameFile + ".json";
    }
    this.$http.get('./storage/' + this.nameFile)
      .then(response => {
        this.awesomeStudent = response.data.etudiants;
        this.awesomeChoice = response.data.Choix;
      });
  }

  ChargerVersion() {
    if (!/json$/.test(this.nameFile)) {
      this.nameFile = this.nameFile + ".json";
    }
    this.$http.get('./storage/' + this.nameFile).then(response => {
      this.awesomeStudent = response.data.student;
      this.awesomeChoice = response.data.choice;
      this.models = response.data.liste_gauche;
      this.models_second = response.data.liste_droite;
    })
  }

  saveJSON = function () {


    this.$scope.data.version = 1;
    this.$scope.data.choice = this.awesomeChoice;
    this.$scope.data.student = this.awesomeStudent;
    this.$scope.data.liste_gauche = this.models;
    this.$scope.data.liste_droite = this.models_second;
    var bla = angular.toJson(this.$scope.data);
    if (this.nameFileOut == undefined) {
      alert("tu n'as pas renseigne le nom d'un fichier");
      return
    }
    var nom_du_fichier = this.nameFileOut + '.json';
    var blob = new Blob([bla], { type: "application/json;charset=utf-8;" });
    var downloadLink = angular.element('<a></a>');
    var testici = window.URL.createObjectURL(blob);
    console.log("1");
    downloadLink.attr('href', testici);
    console.log("2");
    //  downloadLink.attr('href',window.URL.createObjectURL(blob));
    downloadLink.attr('download', nom_du_fichier);
    console.log("3");
    downloadLink[0].click();
    console.log("4");

    console.log(blob);
    this.nameFile = nom_du_fichier;
    var aide_file = [blob];
    console.log("5");
    var fichier = new File(aide_file, nom_du_fichier);
    console.log(fichier);
    console.log("6");
    this.Upload.upload({
      url: 'api/things/upload',
      data: { file: fichier }
    })

  };

  fcttest(param1) {
    param1.test = param1.test + 1;
    console.log("pourquoi ?");
  }
  fctstart(item) { // ne pas utiliser dnd-start
    console.log(item);
    console.log("commencer");
  }
  fctend(item, place) { // modifie l'objet de base.
    console.log(place + " place");
    item.test = this.Ajout(item.test, place)
    console.log(item);
    console.log("fini");
  }

  fctinsert(item) { // modifie l'objet creer.
    item.test = 3;
    console.log(item)
    console.log("insertion");
  }

  ChargerFichier() {
    if (!/json$/.test(this.nameFile)) {
      this.nameFile = this.nameFile + ".json";
    }
    this.$http.get('./storage/' + this.nameFile)
      .then(response => {
        this.awesomeStudent = response.data.etudiants; // ensemble des étudiants du fichier
        this.awesomeChoice = response.data.Choix; //  ensemble des choix avec leur options
        this.models.lists = {};
        this.models_second.lists = {};
        console.log(response.data);
        this.consultation_id = response.data.consultation;
        console.log(this.consultation_id);
        console.log("le choix");
        console.log(this.awesomeChoice);

        for (var i = 0; i < this.awesomeChoice.length; ++i) { // pour tout les choix
          var provisoire = this.awesomeChoice[i].nom; // on met le nom du choix dans une variable
          var id = this.awesomeChoice[i].id; // on met l id du choix 
          //console.log(provisoire);
          var container = {
            bids: {
              people: []
            },
            argument: {
              people: []
            },
            preference: {
              people: []
            },
            dictator: {
              people: []
            }
          };

          for (var w = 0; w < this.awesomeChoice[i].options.length; w++) {
            this.awesomeChoice[i].options[w].containers = {};
            this.awesomeChoice[i].options[w].containers = container;

          }
          this.models.lists[provisoire] = { allowedTypes: [provisoire], people: [] }; // on ajoute le choix en entré en disant que seul les individus du meme type peuvent venir, choix = parcours, module un etc
          this.models_second.lists[provisoire] = { allowedTypes: [provisoire], people: [], choice: this.awesomeChoice[i].options }; // on fait la meme chose dans la liste de droite
          for (var j = 0; j < this.awesomeStudent.length; ++j) { // pour tout les étudiants on va recuperer les valeurs pour chaque options.
            var provisoire_consultation = [];
            for (var w = 0; w < this.awesomeStudent[j].consultation.length; ++w) {
              if (this.awesomeStudent[j].consultation[w].id_choix == id) {
                provisoire_consultation.push(this.awesomeStudent[j].consultation[w])
              }
            }
            this.models.lists[provisoire].people.push({ nom: this.awesomeStudent[j].nom, test: 1, prenom: this.awesomeStudent[j].prenom, type: provisoire, consultation: provisoire_consultation });
          }
        }


        this.creationOption();
        console.log(this.choice);
        this.creationStudent();

      });

  }



  creationOption() {

    for (var i = 0; i < this.awesomeChoice.length; i++) {
      var tmp = this.awesomeChoice[i];
      this.choice[tmp.id] = {};
      var option = {};
      console.log(tmp + " temporaire");
      for (var j = 0; j < tmp.options.length; j++) {
        var tmp_choix = tmp.options[j];
        var divers = { bids: {}, arguments: {}, pref: {} };
        var affectation = { bids: [], arguments: [], preference: [], dictator: [] }
        option[tmp_choix.id] = ({ nom: tmp_choix.nom, max: tmp_choix.place_maxi, min: tmp_choix.place_min, affect: divers, affect_real: affectation });

      }
      this.choice[tmp.id] = { nom: tmp.nom, option: option, place: i };
    }

    for (var i = 0; i < this.awesomeStudent.length; i++) {

      for (var j = 0; j < this.awesomeStudent[i].consultation.length; j++) {
        var pos = this.awesomeStudent[i].consultation[j];


        if (!this.choice[pos.id_choix]["option"][pos.id_option]["affect"]["bids"].hasOwnProperty(pos.bids)) {
          this.choice[pos.id_choix]["option"][pos.id_option]["affect"]["bids"][pos.bids] = [];
        }

        this.choice[pos.id_choix]["option"][pos.id_option]["affect"]["bids"][pos.bids].push(pos.id_etudiant);

        if (!this.choice[pos.id_choix]["option"][pos.id_option]["affect"]["pref"].hasOwnProperty(pos.preference)) {
          this.choice[pos.id_choix]["option"][pos.id_option]["affect"]["pref"][pos.preference] = [];
        }

        this.choice[pos.id_choix]["option"][pos.id_option]["affect"]["pref"][pos.preference].push(pos.id_etudiant);

        if (pos.hasOwnProperty("arguments")) {


          for (var w = 0; w < pos.arguments.length; w++) {
            if (!this.choice[pos.id_choix]["option"][pos.id_option]["affect"]["arguments"].hasOwnProperty(pos.arguments[w])) {
              this.choice[pos.id_choix]["option"][pos.id_option]["affect"]["arguments"][pos.arguments[w]] = [];
              console.log(pos.id_etudiant + " on cree une nouvelle entrée");
            }
            this.choice[pos.id_choix]["option"][pos.id_option]["affect"]["arguments"][pos.arguments[w]].push(pos.id_etudiant);
          }
        }

      }
    }
  }


  creationStudent() {

    for (var j = 0; j < this.awesomeStudent.length; j++) {

      var etudiant = this.awesomeStudent[j];
      var liste_type = [];
      for (var prop in this.choice) {
        liste_type.push(this.choice[prop]["nom"]);
      }
      this.student[etudiant.id] = { nom: etudiant.nom, prenom: etudiant.prenom, type: liste_type, id: etudiant.id };



    }
    console.log(this.student);
    this.awesomeStudent = this.student;
  }


  choiceStudent(item, parcours, choix, raison, valeur) {

    this.request = parcours + "." + choix + "." + raison + " = " + valeur;
    
    var tab = {};
    for (var j = 0; j < item.length; j++) {
      console.log(item[j]);
      tab[item[j]] = this.student[item[j]];
    }

    this.awesomeStudent = tab;
  }

  choiceAllStudent() {
    this.awesomeStudent = this.student;
    console.log(this.awesomeStudent);
    this.awesomeStudent.toString();
    
  }

  coloration(item, bool) {

    for (var j = 0; j < item.length; j++) {
      this.student[item[j]]["color"] = bool;
      console.log(this.student[item[j]]);
    }

  }






  Ajout(type, place) {
    type[place] = "1";
    return type;
  }

  fctlog(item, choice) {

    console.log(this.consultation_id);
    /* console.log(item);
     console.log("c est le choix tant");
     console.log(choice); /*
     var newtype = ""; // type de l'objet de base
     var newtypeobjet = ""; // type de l objet final
     choice++;
     for (var i = 0; i < item.type.length; i++) {
       if (i == 0) {
         newtype = "a";
         newtypeobjet = "a";
       }
       else if (i == choice) {
         newtype = newtype + "1";
         newtypeobjet = newtypeobjet + "0";
       }
       else {
         newtype = newtype + item.type[i];
         newtypeobjet = newtypeobjet + "1";
       }
     }
     item.type = newtypeobjet;
     this.student[item.id]["type"] = newtype;
 */

    var index_to_delete = item.type.indexOf(choice.nom)
    if (index_to_delete >= 0) {
      var element_delete = item.type.splice(index_to_delete, 1);
      this.student[item.id]["type"] = item.type;
      item.type = element_delete;
      return item;
    }


  }

  selection(destination, affect) {

    for (var person in this.awesomeStudent) {
      if (this.awesomeStudent[person]["select"]) {
        console.log("on passe le premier if");
        // this.fctlog(this.awesomeStudent[person], destination);
        var item = this.awesomeStudent[person];


        var index_to_delete = item.type.indexOf(destination.nom);
        console.log(index_to_delete);
        if (index_to_delete >= 0) {
          var tmp = JSON.stringify(item);
          tmp = JSON.parse(tmp);

          var stp = this.fctlog(tmp, destination);
          console.log(stp);
          affect.push(stp);
        }

      }
    }

    /*
        for (var person in this.awesomeStudent) {
          if (this.awesomeStudent[person]["select"]) {
            console.log("on passe la premier if");
            console.log(destination );
            
            //console.log((destination.allowedTypes).indexOf(this.awesomeStudent[person]["type"]));
            console.log(this.awesomeStudent[person]["type"].indexOf(destination.allowedTypes));
            if ((destination.allowedTypes).indexOf(this.awesomeStudent[person]["type"]) >= 0) {
              console.log("on passe le second if ");
              var tmp = this.awesomeStudent[person];
              console.log(tmp);
              console.log("il s agit de tmp");
              tmp = JSON.stringify(tmp);
              tmp = JSON.parse(tmp);
              var stp = this.fctlog(tmp, destination);
              affect.push(stp);
           }
          }
        }*/


  }

  count(item) {
  
  console.log(Array.isArray(this.awesomeStudent))
   var valeur = 0 ;
  
 for(var i = 0 ;i < item.length;i ++ ){
     if (this.awesomeStudent.hasOwnProperty(item[i]))
     valeur++;
   }
   return valeur;
  // return item.length;
  
  }

  saveCsv = function () {
    console.log(this.consultation_id);
    var bla = "";
    // this.consultation_id = 1;
    if (this.nameFileOut == undefined) {
      alert("tu n'as pas renseigne le nom d'un fichier");
      return
    }

    for (var i in this.choice) {

      for (var prop in this.choice[i]["option"]) {
        console.log("plantage ici");
        console.log(i);
        console.log(this.choice[i]);
        var tmp = this.choice[i]["option"][prop]["affect_real"];
        console.log(tmp);
        for (var raison in tmp) {

          for (var j = 0; j < tmp[raison].length; j++) {
            console.log(tmp[raison][j]);
            bla = bla + this.consultation_id + ";" + tmp[raison][j]["id"] + ";" + prop + ";" + i + " \n";
          }
        }
      }
    }

    var nom_du_fichier = this.nameFileOut + '.csv';
    var blob = new Blob([bla], { type: "application/json;charset=utf-8;" });
    var downloadLink = angular.element('<a></a>');
    var testici = window.URL.createObjectURL(blob);
    downloadLink.attr('href', testici);
    downloadLink.attr('download', nom_du_fichier);
    downloadLink[0].click();
    //this.nameFile = nom_du_fichier;
    var aide_file = [blob];
    var fichier = new File(aide_file, nom_du_fichier);
    this.Upload.upload({
      url: 'api/things/upload',
      data: { file: fichier }
    })

  }

  operator(operator) {
    this.request = this.request + operator;
  }



}





export default angular.module('miuapsbisApp.request', [uiRouter])
  .config(routing)
  .component('request', {
    template: require('./request.html'),
    controller: RequestController
  })
  .name;

