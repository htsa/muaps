'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('main', {
    url: '/poubelle',
    template: '<main></main>'
  });
}
