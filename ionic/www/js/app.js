(function() {
	'use strict';

	angular
		.module(
			'starter', [
				'ionic',
			]
		)
		.config(config)
		.run(run)

	;

	function config(
		$stateProvider,
		$urlRouterProvider
	) {
		$stateProvider
			.state(
				'sideMenus', {
					abstract: true,
					templateUrl: 'templates/sideMenus.html',
					url: '/',
				}
			)
			.state(
				'sideMenus.home', {
					url: 'home',
					views: {
						'sideMenus': {
							templateUrl: 'templates/home.html',
						},
					},
				}
			)
			.state(
				'sideMenus.sub', {
					url: 'sub',
					views: {
						'sideMenus': {
							templateUrl: 'templates/sub.html',
						},
					},
				}
			)

		;

		$urlRouterProvider.otherwise('/home');
	}

	function run(
		$ionicPlatform
	) {
		$ionicPlatform.ready(
			function() {}
		);
	}
}());
