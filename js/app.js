(function() {
"use strict";

window.App = Ember.Application.create();

App.Router.map(function() {
  this.resource('album', { path: '/album/:album_id' });
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return App.ALBUM_FIXTURES;
  }
});

App.AlbumRoute = Ember.Route.extend({
  model: function(params) {
    return App.ALBUM_FIXTURES.findProperty('id', params.album_id);
  },

  events: {
    play: function(song) {
      this.controllerFor('nowPlaying').set('model', song);
    }
  }
});

App.NowPlayingController = Ember.ObjectController.extend();

App.Album = Ember.Object.extend({
  totalDuration: function() {
    return this.get('songs').reduce(function(sum, song) {
      return sum + song.get('duration');
    }, 0);
  }.property('songs.@each.duration')
});

App.Song = Ember.Object.extend();

App.AudioPlayerComponent = Ember.Component.extend({
  classNames: 'audio-control',

  duration: 0,
  currentTime: 0,
  isLoaded: false,

  didInsertElement: function() {
    var $audio = this.$('audio'),
        component = this;

    $audio.on('loadedmetadata', function() {
      component.set('duration', Math.floor(this.duration));
      component.set('isLoaded', true);
    });

    $audio.on('timeupdate', function() {
      component.set('currentTime', Math.floor(this.currentTime));
    });

    $audio.on('play', function() {
      component.set('isPlaying', true);
    });

    $audio.on('pause', function() {
      component.set('isPlaying', false);
    });
  },

  pause: function() {
    this.$('audio')[0].pause();
  },

  play: function() {
    this.$('audio')[0].play();
  }
});

Ember.Handlebars.helper('format-duration', function(seconds) {
  var minutes = Math.floor(seconds/60);
  var remainingSeconds = seconds % 60;

  var result = '';
  if (remainingSeconds < 10) {
    result = "0";
  }

  result += String(remainingSeconds);

  result = minutes + ":" + result;

  return result;
});

})();
