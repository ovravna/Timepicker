let app = angular.module('myApp', ['ngMaterial', 'angular.circular-slider']);

Number.prototype.map = function(in_min, in_max, out_min, out_max) {
    return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};

Number.prototype.round = function(toNearest) {
    return toNearest * Math.round(this / toNearest);

}

Number.prototype.mod = function(n) {
    return ((this % n) + n) % n;
}

app.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('teal')
        .accentPalette('orange');
});

app.controller('timeCtrl', function ($scope) {


});

app.directive('timeslider', function() {
    return {
        restrict: 'E',
        templateUrl: 'timeslider.html',
        link: function($scope) {
            $scope.value = $scope.initValue();
            $scope.onSlide = function onSlide(value) {
                $scope.rotateHandTo(value);
                $scope.setTime(value);

            };

            $scope.onSlideEnd = function onSlideEnd(value) {
                // $scope.rotateHandTo(value - 90);
                $scope.setNearestTime(value);
            };
        }

    };
});

app.directive('timepicker', function () {

    return {
        restrict: 'E',
        templateUrl: 'template.html',
        require: 'ngModel',
        scope: true,

        link: function($scope) {

            $scope.time = moment();
            $scope.isHourState = true;


            $scope.angles = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
            $scope.hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
            $scope.convertToTime = function(angle) {


                let t = (angle / 30 + 3) % 12;

                if ($scope.isHourState) {
                    if (t == 0) {
                        t = 12;

                    }
                } else {
                    t *= 5;
                }

                return t;
            };

            $scope.convertToTimeString = function(angle) {
                let t = $scope.convertToTime(angle);
                let s = t.toString();

                if (!$scope.isHourState && t < 10) {
                    s = '0' + s;
                }
                return s;
            };


            $scope.toHourState = function() {
                $scope.isHourState = true;
                $scope.initValue();

            };
            $scope.toMinuteState = function() {
                $scope.isHourState = false;
                $scope.initValue();
            };

            $scope.isAM = function() {
                return $scope.time.format('a') == 'am'
            };


            $scope.toAM = function() {
                if (!$scope.isAM()) {
                    $scope.time.subtract(12, 'hours');

                }
            };

            $scope.toPM = function() {
                if ($scope.isAM()) {
                    $scope.time.add(12, 'hours');
                }
            };


            $scope.isActiveTime = function(angle) {
                return angle == $scope.value;
            };

            $scope.setTime = function(angle) {
                let h = $scope.convertToTime(angle);


                if ($scope.isHourState) {
                    let isAm = $scope.isAM();
                    if (h == 12 && isAm) {
                        h = 0;
                    }
                    else if (!isAm && h != 12) {
                        h += 12
                    }

                    $scope.time.hours(h);
                    // $scope.isHourState = false;

                } else {
                    $scope.time.minutes(h);
                }
            };

            $scope.setActiveTime = function(angle) {
                $scope.setTime(angle);
                $scope.rotateHandTo(angle);
                $scope.value = angle;

                $scope.$apply()
            };

            $scope.rotateHandTo = function(angle) {

                $scope.timeHandStyle = 'rotate(' + angle + 'deg)';
                // document.getElementById('time-hand').style.transform = 'rotate(' + angle + 'deg)';

            };


            $scope.setNearestTime = function(angle) {
                let rounder = $scope.isHourState ? 30 : 6;
                let roundAngle = angle.round(rounder);
                $scope.setActiveTime(roundAngle);
                $scope.$apply()


            };


            $scope.ok = function() {
                if ($scope.isHourState) {
                    $scope.isHourState = false;
                    $scope.initValue();
                } else {
                    alert('Time is ' + $scope.time.format('HH:mm'));

                }
            };

            $scope.cancel = function() {
                reset();
            };

            $scope.initValue = function() {
                let angle = 0;
                if ($scope.isHourState) {
                    let h = $scope.time.hours() % 12;
                    angle = h * 30;
                } else {
                    let m = $scope.time.minutes();
                    angle = m * 6;
                }
                angle = (angle - 90).mod(360);
                $scope.rotateHandTo(angle);
                $scope.value = angle;
                return angle;
            };


            function reset() {
                $scope.time = moment();
                $scope.isHourState = true;
                $scope.initValue();
            }

            reset();

        }
    };
});
