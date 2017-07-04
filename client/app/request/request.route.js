'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('request', {
    url: '/request',
    template: '<request></request>'
  });
}
