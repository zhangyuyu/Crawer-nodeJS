var cheerio = require('cheerio');  
var request = require('sync-request');  
var fs = require('fs');

var url = 'http://movie.douban.com/subject/25662329/'; //这里是举个例子而已，豆瓣的具体的电影网址可以自己替换
var html = request('GET', url).getBody().toString();

function handleDB(html) {
  var $ = cheerio.load(html);
  var info = $('#info');

  var movieName = $('#content>h1>span').filter(function(i, el){
    return $(this).attr('property') === 'v:itemreviewed';
  }).text();

  var directories = '- 导演：' + $('#info span a').filter(function(i, el) {
    return $(this).attr('rel') === 'v:directedBy';
  }).text();

  var starsName = '- 主演：'; 
  $('.actor .attrs a').each(function(i, el) {
    starsName += $(this).text() + '/';
  });

  var runTime = '- 片长：' + $('#info span').filter(function(i, el) {
    return $(this).attr('property') === 'v:runtime';
  }).text();

  var kind = '- 影片类型：';
  $('#info span').filter(function(i, el) {
    return $(this).attr('property') === 'v:genre';
  }).each(function(i, el) {
    kind += $(this).text() + '/';
  });

  var DBScore = $('.ll.rating_num').text();
  var DBVotes = $('a.rating_people>span').text().replace(/\B(?=(\d{3})+$)/g,',');
  var DB = '- 豆瓣评分：' + DBScore + '/10 ' + '(from ' + DBVotes + ' users)';
  var IMDBLink = $('#info').children().last().prev().attr('href');

  var data = '《' + movieName + '》'  + '\r\n'
	  + directories + '\r\n'
	  + starsName + '\r\n'
	  + runTime + '\r\n'
	  + kind+ '\r\n'
	  + DB +'\r\n';

  fs.appendFile('dbmovie.txt', data, 'utf-8', function(err){
    if (err) throw err;
    else console.log('Write successfully...'+'\r\n' + data)
  });
}

handleDB(html);
