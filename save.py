import SimpleHTTPServer

PORT = 8761

Handler = SimpleHTTPServer.SimpleHTTPRequestHandler

class Server(SimpleHTTPServer.SimpleHTTPServer):

    def do_POST(self, *args):
        print args

httpd = Server(("", PORT), Handler)

print "serving at port", PORT
httpd.serve_forever()

