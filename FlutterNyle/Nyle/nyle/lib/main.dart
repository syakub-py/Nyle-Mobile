import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Nyle',
      theme: ThemeData(
        // This is the theme of your application.
        //
        // TRY THIS: Try running your application with "flutter run". You'll see
        // the application has a blue toolbar. Then, without quitting the app,
        // try changing the seedColor in the colorScheme below to Colors.green
        // and then invoke "hot reload" (save your changes or press the "hot
        // reload" button in a Flutter-supported IDE, or press "r" if you used
        // the command line to start the app).
        //
        // Notice that the counter didn't reset back to zero; the application
        // state is not lost during the reload. To reset the state, use hot
        // restart instead.
        //
        // This works for code too, not just values: Most code changes can be
        // tested with just a hot reload.
        colorScheme: ColorScheme.light(primary: Colors.white), // Use ColorScheme.fromSwatch
        primaryColor: Colors.white,
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'Nyle'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    // This method is rerun every time setState is called, for instance as done
    // by the _incrementCounter method above.
    //
    // The Flutter framework has been optimized to make rerunning build methods
    // fast, so that you can just rebuild anything that needs updating rather
    // than having to individually change instances of widgets.
    return Scaffold(
      appBar: AppBar(
        // TRY THIS: Try changing the color here to a specific color (to
        // Colors.amber, perhaps?) and trigger a hot reload to see the AppBar
        // change color while the other colors stay the same.
        backgroundColor: Theme.of(context).colorScheme.primary,
        // Here we take the value from the MyHomePage object that was created by
        // the App.build method, and use it to set our appbar title.
        title: Text(
            widget.title,
            style: TextStyle(color: Colors.black),
        ),
        actions: <Widget>[
          // Add your button here
          IconButton(
            icon: Icon(Icons.person), // Replace with the icon you want
            onPressed: () {
              // Handle the button press
            },
          ),
        ],
      ),
      body: Center(
        child:SingleChildScrollView(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Card(
                child: Image.network(
                  'https://cf.bstatic.com/xdata/images/hotel/max1024x768/390681617.jpg?k=434ce66ab47a1f81b179b5fb91b807a87b431d98e398025b01538e0db4106cd0&o=&hp=1', // Replace with the URL of the image
                  loadingBuilder: (BuildContext context, Widget child, ImageChunkEvent? loadingProgress) {
                    if (loadingProgress == null) {
                      return child; // Return the image if it's fully loaded.
                    }
                    return CircularProgressIndicator(
                      value: loadingProgress.expectedTotalBytes != null
                          ? loadingProgress.cumulativeBytesLoaded / loadingProgress.expectedTotalBytes!
                          : null,
                    );
                  },
                  errorBuilder: (context, error, stackTrace) {
                    return Text('Failed to load image');
                  },
                ),
              ),
              Card(
                child: Image.network(
                  'https://cf.bstatic.com/xdata/images/hotel/max1024x768/390681617.jpg?k=434ce66ab47a1f81b179b5fb91b807a87b431d98e398025b01538e0db4106cd0&o=&hp=1', // Replace with the URL of the image
                  loadingBuilder: (BuildContext context, Widget child, ImageChunkEvent? loadingProgress) {
                    if (loadingProgress == null) {
                      return child; // Return the image if it's fully loaded.
                    }
                    return CircularProgressIndicator(
                      value: loadingProgress.expectedTotalBytes != null
                          ? loadingProgress.cumulativeBytesLoaded / loadingProgress.expectedTotalBytes!
                          : null,
                    );
                  },
                  errorBuilder: (context, error, stackTrace) {
                    return Text('Failed to load image');
                  },
                ),
              ),
              Card(
                child: Image.network(
                  'https://cf.bstatic.com/xdata/images/hotel/max1024x768/390681617.jpg?k=434ce66ab47a1f81b179b5fb91b807a87b431d98e398025b01538e0db4106cd0&o=&hp=1', // Replace with the URL of the image
                  loadingBuilder: (BuildContext context, Widget child, ImageChunkEvent? loadingProgress) {
                    if (loadingProgress == null) {
                      return child; // Return the image if it's fully loaded.
                    }
                    return CircularProgressIndicator(
                      value: loadingProgress.expectedTotalBytes != null
                          ? loadingProgress.cumulativeBytesLoaded / loadingProgress.expectedTotalBytes!
                          : null,
                    );
                  },
                  errorBuilder: (context, error, stackTrace) {
                    return Text('Failed to load image');
                  },
                ),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: Card(
        elevation: 12, // Set the desired elevation
        margin: EdgeInsets.all(18),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10.0), // Adjust the radius as needed
        ),
        child: BottomAppBar(
          elevation: 12,
          color: Color.fromRGBO(0, 0, 0, 0),
          //shape: CircularNotchedRectangle(),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              IconButton(
                icon: Icon(Icons.home_rounded),
                onPressed: () {
                  // Handle the button1 press
                },
              ),
              IconButton(
                icon: Icon(Icons.auto_graph),
                onPressed: () {
                  // Handle the button2 press
                },
              ),
              IconButton(
                icon: Icon(Icons.add_circle_outline),
                onPressed: () {
                  // Handle the button3 press
                },
              ),
              IconButton(
                icon: Icon(Icons.chat_rounded),
                onPressed: () {
                  // Handle the button4 press
                },
              ),
              IconButton(
                icon: Icon(Icons.person),
                onPressed: () {
                  // Handle the button5 press
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
