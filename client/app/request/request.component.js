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
    this.element_select = {
      content: {},
      place: {}
    };
    this.request = []; // requete.
    this.awesomeStudent = [];
    this.nameFile = this.$rootScope.file_name;
    this.$rootScope.file_name = this.nameFile;
    this.models_second = {
    };
    this.scale_of_value = {};
    $scope.model = this.models_second;

    $scope.data = {
      student: this.awesomeStudent,
      choice: this.awesomeChoice,
      liste_gauche: this.models,
      liste_droite: this.models_second,
    };


    $scope.total = this;

    $scope.request = this.request

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });

    $scope.$watch("request", function () {
      console.log("on vous observe")
      if ($scope.total.request.length > 0) {
        $scope.total.doRequest();
      }
    }, true);

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
  /*
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
    }*/

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

  deleterequest() {
    this.request = [];
    this.$scope.request = this.request
    this.choiceAllStudent()
  }

  choiceStudent(choix, option, raison, valeur, idchoix, idoption) {

    if(valeur == -1 && this.element_select.content["type"] != "choix"){
      return
    }

    var taille = this.request.length - 1;

    console.log(taille);

    if (taille == -1 || this.request[taille]["type"] == "parenthese" || this.request[taille]["type"] == "operateur" || this.element_select.content["type"] == "choix") {


      var nom = choix + "." + option.nom + "." + raison;
      var objet = { label: nom, id: idoption, type: "choix", idparent: idchoix, critere: raison };

      var operateur = { label: "=", type: "operator" };
      var value = { label: valeur, type: "valeur" };

      if (this.element_select.hasOwnProperty("content")) {
        if (this.element_select.content["type"] == "choix") {
          console.log("on passe dans le if")
          this.request[this.element_select.place] = objet;
          if (raison == "arguments") {
            this.request[this.element_select.place + 1] = operateur;
          }
          return
        }
      }

      this.request.push(objet);
      this.request.push(operateur);
      this.request.push(value);
    }

    /*console.log(this.awesomeChoice);
    console.log("choice");
    console.log(this.choice);
    console.log(this.request);
    var tab = {};
    for (var j = 0; j < item.length; j++) {
      console.log(item[j]);
      tab[item[j]] = this.student[item[j]];
    }

    this.awesomeStudent = tab;*/
    // this.doRequest();
  }

  operator(operator) {
    var flag = this.request.length - 1;
    console.log("pourquoi tu passes pas ici")
    var operateur = { label: operator, type: "operateur" }



    if (this.element_select["content"]["type"] == "operateur") {
      this.request[this.element_select["place"]] = operateur
      console.log("on modifie la requete")
      if (operator == "||") {
        this.choiceAllStudent();
      }
      return
    }

    if (flag == -1 || this.request[flag]["type"] != "valeur") {
      console.log("mauvaise grammaire")
      return;
    }
    this.request.push(operateur)
    if (operator == "||") {
      this.choiceAllStudent();
    }

  }

  changementOperator(operator) {
    console.log("on entre dans la fonction");

    if (this.element_select.hasOwnProperty("content")) {
      if (this.element_select.content["type"] == "operator") {
        var newOperator = { label: operator, type: "operator" };
        this.request[this.element_select.place] = newOperator;
      }
    }

  }

  changeValue(value) {
    // var newvalue = {label : value , type : "valeur"}
    this.request[this.element_select.place]["label"] = value;
  }

  test(o) {

    console.log("putain");
  }


  typeOperator(tab, signe, value) { // cherche dans un tableau toutes les valeurs remplisant la condition signe value
    var tableau_final = []

    console.log(tab);
    console.log(signe);
    console.log(value);

    if (signe == "=") {
      if (tab.hasOwnProperty(value)) {
        tableau_final = tab[value];
      }
    }

    if (signe == "<") {
      for (var prop in tab) {
        if (prop < value) {
          tableau_final = tableau_final.concat(tab[prop])
        }
      }

    }

    if (signe == "<=") {
      for (var prop in tab) {
        if (prop <= value) {
          tableau_final = tableau_final.concat(tab[prop])
        }
      }
    }

    if (signe == ">") {
      for (var prop in tab) {
        if (prop > value) {
          tableau_final = tableau_final.concat(tab[prop])
        }
      }
    }
    if (signe == ">=") {
      for (var prop in tab) {
        if (prop >= value) {
          tableau_final = tableau_final.concat(tab[prop])
        }
      }
    }

    return (tableau_final);
  }

  doRequestAux(tab, connector, tab2) { // permet de faire les jonctions
    console.log(tab)
    console.log(connector)
    console.log(tab2)
    console.log("on est dans la fonction")
    var result = []

    if (connector == "&&") {
      tab2.forEach(function (element) {
        if (tab.indexOf(element) > -1) {
          result.push(element)
        }

      }, this);

    }
    if (connector == "||") {

      result = tab;

      tab2.forEach(function (element) {
        if (tab.indexOf(element) == -1) {
          console.log("ici on passe bien dans le ou")
          result.push(element)
        }

      }, this);

    }
    if (connector == "&|") {
      console.log("on passe bien dans et pas ")
      result = tab;

      tab2.forEach(function (element) {

        if (result.indexOf(element) >= 0) {

          var tmp = result.indexOf(element)
          result.splice(tmp, 1)

        }

      }, this);


    }

    console.log("le resultat est")
    console.log(result)
    return result

  }

  doRequest() {

    var tableau_initial = [] // tableau de base contenant tout les étudiants 
    for (var prop in this.student) {
      var tmp = prop
      tableau_initial.push(tmp)
    }
    var fin = [];

    var item = this.request[0];
    var signe = this.request[1]["label"];
    var value = this.request[2]["label"];

    var idparent = item["idparent"];
    var idoption = item["id"];
    var raison = item["critere"];

    var tableau_pre_traitement = this.choice[idparent]["option"][idoption]["affect"][raison]

    tableau_pre_traitement = this.typeOperator(tableau_pre_traitement, signe, value);
    tableau_initial = this.doRequestAux(tableau_initial, "&&", tableau_pre_traitement)



    for (var i = 4; i < this.request.length; i = i + 4) {

      var item = this.request[i];
      var signe = this.request[i + 1]["label"];
      var value = this.request[i + 2]["label"];

      var idparent = item["idparent"];
      var idoption = item["id"];
      var raison = item["critere"];

      var tableau_pre_traitement = this.choice[idparent]["option"][idoption]["affect"][raison]

      fin = this.typeOperator(tableau_pre_traitement, signe, value);


      console.log("on est encore dans le for")
      tableau_initial = this.doRequestAux(tableau_initial, this.request[i - 1]["label"], fin)
      console.log(tableau_initial)
    }




    var tab = {};
    for (var j = 0; j < tableau_initial.length; j++) {
      console.log(tableau_initial[j]);
      tab[tableau_initial[j]] = this.student[tableau_initial[j]];
    }

    this.awesomeStudent = tab;
    console.log(this.request.length)
    var dernier_element = this.request.length
    if (this.request[this.request.length - 1]["label"] == "||") {
      this.choiceAllStudent();
    }

  }

  switchRequest(element, position) {

    this.scale_of_value.bool = false;

    if (position == this.element_select.place) { // permet de deselectionner un element 
      this.element_select = {
        content: {},
        place: {}
      }
      console.log(this.element_select);
    }
    else {
      this.element_select.content = element;
      this.element_select.place = position;

      if (element.type == "valeur") {
        if (this.request[position - 2]["critere"] == "bids" || this.request[position - 2]["critere"] == "pref") {
          this.scale_of_value.bool = true;
          var idchoix = this.request[position - 2]["idparent"];
          var idoption = this.request[position - 2]["id"];
          var critere = this.request[position - 2]["critere"];

          this.scale_of_value.content = this.choice[idchoix]['option'][idoption]['affect'][critere]


        }
      }

      console.log(this.element_select);
    }
  }




  choiceAllStudent() {
    this.awesomeStudent = this.student;
    this.awesomeStudent.toString();

  }

  coloration(item, bool) {
    for (var j = 0; j < item.length; j++) {
      this.student[item[j]]["color"] = bool;
    }

  }






  Ajout(type, place) {
    type[place] = "1";
    return type;
  }

  fctlog(item, choice) {

    console.log(this.consultation_id);


    var index_to_delete = item.type.indexOf(choice.nom)
    if (index_to_delete >= 0) {
      var element_delete = item.type.splice(index_to_delete, 1);
      this.student[item.id]["type"] = item.type;
      item.type = element_delete;
      return item;
    }


  }

  removeAffect(item, position, tableau) {
    console.log(item)
    this.awesomeStudent[item.id]["type"].push(item.type[0])
    tableau.splice(position, 1)
  }

  selection(destination, affect, max_place, attribue) {
    console.log("nombre de place maximun" + max_place)
    var selectionnee = []
    var selectionsecond = []
    var erreur = ""


    for (var person in this.awesomeStudent) {
      if (this.awesomeStudent[person]["select"]) {
        console.log("on passe le premier if");

        // this.fctlog(this.awesomeStudent[person], destination);

        selectionnee.push(this.awesomeStudent[person])
      }
    }

    console.log("on passe dans le second if")
    for (var person in selectionnee) {
      console.log("on passe dans le second for")

      var item = selectionnee[person];
      console.log(item)

      var index_to_delete = item.type.indexOf(destination.nom);
      console.log(index_to_delete);
      if (index_to_delete >= 0) {
        selectionsecond.push(item)
      }
      else {
        console.log(item)
        erreur = erreur + item.prenom + " " + item.nom + " est deja affecté a ce choix \n"
      }
    }
    if (selectionsecond.length + attribue <= max_place) {
      for (var person in selectionsecond) {
        item = selectionsecond[person]

        var tmp = JSON.stringify(item);
        tmp = JSON.parse(tmp);

        var stp = this.fctlog(tmp, destination);
        console.log(stp);
        affect.push(stp);
      }
    }
    else {
      var place_restante = max_place - attribue
      erreur = erreur + " on veut affecter " + selectionnee.length + " etudiant cependant il ne reste que " +place_restante + " places"
    }





    if (erreur != "") {
      alert(erreur)
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

  count(item) { // fonction qui compte parmis les étudiant combien on cette propriete.


    var valeur = 0;

    for (var i = 0; i < item.length; i++) {
      if (this.awesomeStudent.hasOwnProperty(item[i]))
        valeur++;
    }
    return valeur;
    // return item.length;

  }

  //permet de savoir si il y a des enfants

  countSon(tab) {
    var valeur = 0;
    for (var prop in tab) {

      valeur = valeur + this.count(tab[prop])
    }
    return valeur;

  }

  countStudentAffect(tab) {
    var valeur = 0;
    for (var prop in tab) {
      valeur = valeur + tab[prop].length
    }
    return valeur
  }

  countSimple(item) { // fonction qui permet de compter le nombre d'element 
    return item.length;
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





}





export default angular.module('miuapsbisApp.request', [uiRouter])
  .config(routing)
  .component('request', {
    template: require('./request.html'),
    controller: RequestController
  })
  .name;

