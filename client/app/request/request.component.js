import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './request.route';

export class RequestController {
  awesomeStudent = [];


  /*@ngInject*/
  constructor($http, $scope, socket, Upload) {
    this.$scope = $scope;
    this.$http = $http;
    this.socket = socket;
    this.$scope = $scope;
    this.Upload = Upload;
    this.awesomeChoice = [];
    this.choice = {};
    this.student = {};
    this.onglet = "general";
    this.models = {
    };

    this.models_second = {
    };
    $scope.model = this.models_second;


    this.binaire = [];


    $scope.data = {
      test: "blabla",
      student: this.awesomeStudent,
      choice: this.awesomeChoice,
      liste_gauche: this.models,
      liste_droite: this.models_second,
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });

    $scope.$watch('model', function (model) {
      $scope.modelAsJson = angular.toJson(model, true);
    }, true);


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
    this.$http.get('./storage/' + this.nameFile)
      .then(res => {
        console.log(res.data.test);
        console.log(res.data.etudiants);
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
        this.onglet = "valide";
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
  /*
  fctbinaire(nbchoix){
    var bin = "";
    var compteur = 0;
    var compteur_max = 2^nbchoix;
  
  for( var i =0; i<nbchoix ; i++){
    bin = bin +"0";
  }
  
    while(compteur < ){
  
    }
  }
  */
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
      this.choice[tmp.id] = { nom: tmp.nom, option: option, allowedTypes: this.CreateType(i), place: i };
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
      this.student[etudiant.id] = { nom: etudiant.nom, prenom: etudiant.prenom, type: "a00", id: etudiant.id };



    }
    console.log(this.student);
    this.awesomeStudent = this.student;
  }


  choiceStudent(item) {

    var tab = {};
    for (var j = 0; j < item.length; j++) {
      console.log(item[j]);


      tab[item[j]] = this.student[item[j]];
    }

    this.awesomeStudent = tab;
    console.log(tab);
  }

  choiceAllStudent() {
    this.awesomeStudent = this.student;
  }

  coloration(item, bool) {

    for (var j = 0; j < item.length; j++) {
      this.student[item[j]]["color"] = bool;
      console.log(this.student[item[j]]);
    }

  }




  CreateType(place) {
    var type = [];

    type.push("a00");
    if (place == 0) {
      type.push("a01");
    }
    else {
      type.push("a10");
    }
    return type;
  }

  Ajout(type, place) {
    type[place] = "1";
    return type;
  }

  fctlog(item, choice) {
    console.log(item);
    console.log(choice);
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
    return item;
  }

  selection(destination, affect) {


    for (var person in this.awesomeStudent) {
      if (this.awesomeStudent[person]["select"]) {
        if ((destination.allowedTypes).indexOf(this.awesomeStudent[person]["type"]) >= 0) {
          var tmp = this.awesomeStudent[person];
          tmp = JSON.stringify(tmp);
          tmp = JSON.parse(tmp);
          var stp = this.fctlog(tmp, destination.place);
          affect.push(stp);
        }
      }
    }
  }

  count(item) {
    return item.length;
  }

  saveCsv = function () {

    var bla = "";
    this.consultation_id = 1;
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
    this.nameFile = nom_du_fichier;
    var aide_file = [blob];
    var fichier = new File(aide_file, nom_du_fichier);
    this.Upload.upload({
      url: 'api/things/upload',
      data: { file: fichier }
    })

  }





}





export default angular.module('miuapsbisApp.request', [uiRouter])
  .config(routing)
  .component('request', {
    template: require('./request.html'),
    controller: RequestController
  })
  .name;

