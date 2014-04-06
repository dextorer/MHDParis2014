#!/usr/bin/python

import os
import json
import urllib2
import subprocess
import argparse
import re
from os import listdir
from os.path import isfile, join
import ast
import copy
import sys

#from getLyrics import APISubtitlesMatcher
verbosity = 0
outputFile = '/home/neo/code/HackDayParis/sentenceHistoryHack/topicExtractor/output.json'
def getTracks(sentence):
	if verbosity=="1":
		print trackInfo
		
	#track_title = trackInfo['title']
	#track_artist = trackInfo['artist']
	#track_album = trackInfo['album']
	#track_duration = trackInfo['duration']
	#track_file = trackInfo['file']
	sent = urllib2.quote(sentence)
	print sentence
	# build api url
	url = "http://api.musixmatch.com/ws/1.1/track.search?apikey=b463ed1270b71853d56be5bd776a9b4a"
	url += "&q_lyrics=" + sent
	url += "&quorum_factor=" + str(1)
	url += "&f_has_lyrics=" + str(1)
	url += "&s_artist_rating=" + 'desc'
	url += "&f_lyrics_language=" + 'en'
	url += "&page_size=" + str(100)
	#url +="&q_track=" + track_title
	#url +="&q_artist=" + track_artist
	#url +="&q_album=" + track_album
	#url +="&f_subtitle_length=" + track_duration
	#url +="&format=json&f_subtitle_length_max_deviation=10&subtitle_format=mxm"

	#print "\n***Processing " + track_file + "\n"
	
	#if verbosity=="1":
	print(url)#,metadata)
	
	response = json.load( urllib2.urlopen( url ) )
	#print response
	track_list = None
	track_list_with_subtitles = []
	try:
		#parse response body
		track_list = response['message']['body']['track_list']#['subtitle_body'];
	except:
		pass

	for idx, track in enumerate(track_list):
		if track['track']['has_subtitles']:
			track_list_with_subtitles.append(track)
	#print track_list_with_subtitles
	
	print len(track_list_with_subtitles)
	trackSubtitles = []
	cnt = 0
	
	for index, track in enumerate(track_list_with_subtitles):
		
		trackInfo = {}
		trackInfo['title'] = track['track']['track_name']
		trackInfo['artist'] = track['track']['artist_name']
		trackInfo['album'] = track['track']['album_name']
		#trackInfo['duration'] = str(track['track']['track_length'])
		#trackInfo['file'] = 'asd'
		trackInfo['spotify_id'] = track['track']['track_spotify_id']
		trackInfo['mbid'] = track['track']['track_mbid']
		trackInfo['trackid'] = track['track']['track_id']
		url = "http://api.musixmatch.com/ws/1.1/track.subtitle.get?apikey=b463ed1270b71853d56be5bd776a9b4a"
		url += "&track_id=" + str(trackInfo['trackid'])
		url += "&subtitle_format=mxm"
		response = json.load( urllib2.urlopen( url ) )
		
		#subtitle_body, response = APISubtitlesMatcher( trackInfo, '0' )
		#print index
		#print response
		#try:
		#print response
		try:
			subtitle_body = response['message']['body']['subtitle']['subtitle_body']
		except:
			print 'stupidstupid'
			continue
		
		try:
			subtitle_body = ast.literal_eval(subtitle_body)
		except:
			print 'stupid'
			continue
		#print index
		
		tms = []
		txt = []
		duration = []
		#print subtitle_body
		for idx, line in enumerate(subtitle_body):
			#print sentence.lower()
			#print line['text'].lower()
			#print idx
			#print sentence.lower()
			#print line['text'].lower()
			if sentence.lower() in line['text'].lower():
				#print 'TRUEEE'
				cnt += 1
				txt.append(line['text'])
				tms.append(line['time']['total'])
				dur = subtitle_body[idx+1]['time']['total'] - line['time']['total']
				duration.append(dur)
			#print idx
		#print tms
		if len(tms) == 0:
			continue
		trackInfo['phrase_times'] = tms[0]
		trackInfo['duration'] = duration[0]
		'''if subtitle_body == 'err' and response == 'err':
			print 'error'
			continue '''
		trackInfo['subtitle'] = txt[0]
		#print index
		trackSubtitles.append(trackInfo)
	#print 'asd'
	#print cnt
	token_result = {}
	token_result['token'] = sentence
	token_result['token_output'] = trackSubtitles
	#filehandle = open(outputFile,'w')
	#json.dump(trackSubtitles, filehandle)
	#filehandle.close()
	return (token_result)#,response)

if __name__ == "__main__":
	os.system("clear")
        
	cmdParser = argparse.ArgumentParser(
		description='Audio Metadata Extractor Tool @2013 MusiXmatch Spa',
		epilog="Enjoy MusiXmatch Lyrics" )
	
	cmdParser.add_argument('--phrase', help='Search phrase')
	#cmdParser.add_argument('--verbose', help='Verbosity level', default=0)
	many_tokens_result = {}
	
	inargs = cmdParser.parse_args()
	result = []
	k = getTracks(inargs.phrase)
	result.append(k)
	many_tokens_result['result'] = result
	
	filehandle = open(outputFile,'w')
	json.dump(many_tokens_result, filehandle)
	filehandle.close()
	
	#sys.stdout.write(str(result))
	'''if inargs.folder is None:
		print "Please specifiy an audio folder"
		exit();
	getLyricsMain(inargs)'''
