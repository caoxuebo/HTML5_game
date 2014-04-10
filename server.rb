#!/usr/bin/ruby

require 'em-websocket'
require 'json'
require 'csv'

def lose_life(left, top)
	puts "Left: #{left} Top #{top}"
	File.open("./logs/lives-lost.txt", "a") {
		|file| file.write("(#{left}, #{top})")
	}
end

def get_highscores(ws)
	
	file = File.open('./logs/high-scores.txt')
	contents = Hash.new
	contents['highscores'] = Array.new
	file.each {
		|line|
		contents['highscores'].push("<li>#{line.chomp}</li>")
		puts contents
	}
	ws.send(contents.to_json)
end

def add_new_highscore(v)
	name = v['name'].gsub(/\s+/, "")
	score = v['score'].to_s.gsub(/\s+/, "")
	File.open("./logs/high-scores.txt", "a") {
		|file| file.write("#{name},#{score}\n")
	}
end

EventMachine.run {
  EventMachine::WebSocket.run(:host => "0.0.0.0", :port => 5301) do |ws|
    ws.onopen { |handshake|

	      puts "WebSocket connection open"

	      # Access properties on the EventMachine::WebSocket::Handshake object, e.g.
	      # path, query_string, origin, headers

	      # Publish message to the client
	      hello = "Hello Client: you connected to #{handshake.path}"
	      ws.send hello.to_json
	    }

    ws.onclose { puts "Connection closed" }

    ws.onmessage { |msg|
		      
	      parsed = JSON.parse(msg)
	      
	      parsed.each do |k,v|
	      	if k == "msg" && v == "ping"
	      		puts "Received message: #{v}"
	      		ws.send "Server Pong: #{v}".to_json
	      	end
	      	if k == "msg" && v == "life lost"
	      		puts "Life lost"
	      		lose_life(parsed['left'], parsed['top'])
	      	end
	      	if k == "msg" && v == "get highscores"
	      		puts "Getting highscores"
	      		get_highscores(ws)
	      	end
	      	if k == "new highscore"
	      		puts "Adding new highscore"
	      		add_new_highscore(v)
	      		get_highscores(ws)
	      	end
	      end
	    }
  end
}