// Content for 30 days of Python tips, tricks, and projects
export interface DailyTip {
  day: number;
  subject: string;
  content: string;
}

export const dailyTips: DailyTip[] = [
  {
    day: 1,
    subject: "Getting Started with Python Basics",
    content: `
      <h2>Welcome to Day 1 of 30 Days of Python!</h2>
      <p>Today we're covering the absolute basics of Python:</p>
      <ul>
        <li>Installing Python</li>
        <li>Running your first script</li>
        <li>Understanding variables and data types</li>
      </ul>
      <h3>Tip of the day:</h3>
      <p>Use the <code>print()</code> function to display output.</p>
      <h3>Mini Project:</h3>
      <p>Create a script that prints "Hello, World!" to the console.</p>
    `
  },
  {
    day: 2,
    subject: "Control Flow in Python",
    content: `
      <h2>Day 2: Control Flow in Python</h2>
      <p>Learn how to control the execution of your code with:</p>
      <ul>
        <li>If, elif, and else statements</li>
        <li>Comparison operators</li>
        <li>Logical operators</li>
      </ul>
      <h3>Tip of the day:</h3>
      <p>Simplify conditional statements using Python's ternary operator.</p>
      <h3>Mini Project:</h3>
      <p>Create a grade calculator based on a test score.</p>
    `
  },
  {
    day: 3,
    subject: "Lists and Loops",
    content: `
      <h2>Day 3: Lists and Loops</h2>
      <p>Today you will learn how to work with lists and iterate over them:</p>
      <ul>
        <li>Creating and modifying lists</li>
        <li>For loops and while loops</li>
        <li>List comprehensions</li>
      </ul>
      <h3>Tip of the day:</h3>
      <p>Use list comprehensions for concise looping and list creation.</p>
      <h3>Mini Project:</h3>
      <p>Create a program that prints squares of numbers 1 to 10.</p>
    `
  },
  {
    day: 4,
    subject: "Dictionaries and Sets",
    content: `
      <h2>Day 4: Dictionaries and Sets</h2>
      <p>Explore Python's dictionary and set data types:</p>
      <ul>
        <li>Storing key-value pairs with dictionaries</li>
        <li>Unique items with sets</li>
        <li>Basic operations and comprehensions</li>
      </ul>
      <h3>Tip of the day:</h3>
      <p>Dictionaries allow quick look-ups using keys.</p>
      <h3>Mini Project:</h3>
      <p>Create a contact manager that uses a dictionary for names and phone numbers.</p>
    `
  },
  {
    day: 5,
    subject: "String Manipulation",
    content: `
      <h2>Day 5: String Manipulation</h2>
      <p>Improve your skills in handling and processing strings:</p>
      <ul>
        <li>Concatenation and slicing</li>
        <li>Useful string methods</li>
        <li>Formatting strings</li>
      </ul>
      <h3>Tip of the day:</h3>
      <p>Use f-strings for clearer and more readable string formatting.</p>
      <h3>Mini Project:</h3>
      <p>Create a program that formats user input into a welcome message.</p>
    `
  },
  {
    day: 6,
    subject: "Functions and Scope",
    content: `
      <h2>Day 6: Functions and Scope</h2>
      <p>Learn how to organize and reuse your code using functions:</p>
      <ul>
        <li>Defining functions</li>
        <li>Understanding local and global scope</li>
        <li>Passing arguments and returning values</li>
      </ul>
      <h3>Tip of the day:</h3>
      <p>Keep your functions small and focused on one task.</p>
      <h3>Mini Project:</h3>
      <p>Create a calculator that performs basic arithmetic operations through functions.</p>
    `
  },
  {
    day: 7,
    subject: "File Input/Output",
    content: `
      <h2>Day 7: File Input/Output</h2>
      <p>Get comfortable with reading from and writing to files in Python:</p>
      <ul>
        <li>Opening and closing files</li>
        <li>Reading data from text files</li>
        <li>Writing data to files</li>
      </ul>
      <h3>Tip of the day:</h3>
      <p>Always close your files or use the <code>with</code> keyword for automatic management.</p>
      <h3>Mini Project:</h3>
      <p>Create a program that logs user input to a text file.</p>
    `
  },
  {
    day: 8,
    subject: "Exception Handling",
    content: `
      <h2>Day 8: Exception Handling</h2>
      <p>Learn how to make your code robust by handling errors:</p>
      <ul>
        <li>Try, except blocks</li>
        <li>Finally and else clauses</li>
        <li>Raising exceptions</li>
      </ul>
      <h3>Tip of the day:</h3>
      <p>Handle exceptions gracefully to improve user experience.</p>
      <h3>Mini Project:</h3>
      <p>Create a program that handles division errors when dividing user inputs.</p>
    `
  },
  {
    day: 9,
    subject: "Modules and Packages",
    content: `
      <h2>Day 9: Modules and Packages</h2>
      <p>Organize your code and reuse libraries with modules and packages:</p>
      <ul>
        <li>Importing standard modules</li>
        <li>Creating your own modules</li>
        <li>Using third-party packages</li>
      </ul>
      <h3>Tip of the day:</h3>
      <p>Keep your code modular by separating functionality into different files.</p>
      <h3>Mini Project:</h3>
      <p>Create a module for common utility functions and use it in a main program.</p>
    `
  },
  {
    day: 10,
    subject: "Introduction to Object-Oriented Programming",
    content: `
      <h2>Day 10: Object-Oriented Programming</h2>
      <p>Begin your journey into classes and objects:</p>
      <ul>
        <li>Defining classes</li>
        <li>Creating objects</li>
        <li>Understanding attributes and methods</li>
      </ul>
      <h3>Tip of the day:</h3>
      <p>Think of classes as blueprints for creating objects.</p>
      <h3>Mini Project:</h3>
      <p>Create a class to represent a book with properties like title and author.</p>
    `
  },
  {
    day: 11,
    subject: "Advanced Object-Oriented Concepts",
    content: `
      <h2>Day 11: Advanced OOP Concepts</h2>
      <p>Dive deeper into object-oriented programming with:</p>
      <ul>
        <li>Inheritance</li>
        <li>Polymorphism</li>
        <li>Encapsulation</li>
      </ul>
      <h3>Tip of the day:</h3>
      <p>Use inheritance to extend classes without rewriting code.</p>
      <h3>Mini Project:</h3>
      <p>Create a small library management system using classes and inheritance.</p>
    `
  },
  {
    day: 12,
    subject: "Iterators and Generators",
    content: `
      <h2>Day 12: Iterators and Generators</h2>
      <p>Learn how to work with data lazily and efficiently:</p>
      <ul>
        <li>Understanding iterators</li>
        <li>Creating generator functions</li>
        <li>Using <code>yield</code></li>
      </ul>
      <h3>Tip of the day:</h3>
      <p>Generators are ideal for handling large datasets without using too much memory.</p>
      <h3>Mini Project:</h3>
      <p>Create a generator that produces an infinite sequence of Fibonacci numbers.</p>
    `
  },
  {
    day: 13,
    subject: "List Comprehensions and Generator Expressions",
    content: `
      <h2>Day 13: List Comprehensions and Generator Expressions</h2>
      <p>Master the art of concise code with comprehension techniques:</p>
      <ul>
        <li>List comprehensions for quick list creation</li>
        <li>Generator expressions for memory-efficient loops</li>
        <li>Conditional comprehensions</li>
      </ul>
      <h3>Tip of the day:</h3>
      <p>Use comprehensions to write cleaner and more Pythonic code.</p>
      <h3>Mini Project:</h3>
      <p>Create a list of squares for even numbers between 1 and 20 using a list comprehension.</p>
    `
  },
  {
    day: 14,
    subject: "Lambda, Map, Filter, and Reduce",
    content: `
      <h2>Day 14: Functional Tools in Python</h2>
      <p>Explore Python’s functional programming tools:</p>
      <ul>
        <li>Lambda functions for anonymous operations</li>
        <li>Map to apply functions to iterables</li>
        <li>Filter to select items</li>
        <li>Reduce to combine values</li>
      </ul>
      <h3>Tip of the day:</h3>
      <p>Combine these tools for expressive and concise code.</p>
      <h3>Mini Project:</h3>
      <p>Create a program that uses <code>map</code> and <code>filter</code> to process a list of numbers.</p>
    `
  },
  {
    day: 15,
    subject: "Decorators",
    content: `
      <h2>Day 15: Understanding Decorators</h2>
      <p>Enhance your functions dynamically with decorators:</p>
      <ul>
        <li>What are decorators?</li>
        <li>How to create custom decorators</li>
        <li>Using built-in decorators</li>
      </ul>
      <h3>Tip of the day:</h3>
      <p>Decorators help encapsulate repetitive tasks in your functions.</p>
      <h3>Mini Project:</h3>
      <p>Create a decorator that logs function calls and execution time.</p>
    `
  },
  {
    day: 16,
    subject: "Virtual Environments and Package Management",
    content: `
      <h2>Day 16: Virtual Environments and Pip</h2>
      <p>Manage your project dependencies effectively:</p>
      <ul>
        <li>Creating virtual environments with <code>venv</code></li>
        <li>Installing packages with pip</li>
        <li>Managing <code>requirements.txt</code> files</li>
      </ul>
      <h3>Tip of the day:</h3>
      <p>Always use virtual environments to keep your projects isolated.</p>
      <h3>Mini Project:</h3>
      <p>Create a new Python project, set up a virtual environment, and install a third-party package.</p>
    `
  },
  {
    day: 17,
    subject: "Web Scraping with Requests and BeautifulSoup",
    content: `
      <h2>Day 17: Web Scraping Basics</h2>
      <p>Learn how to fetch and parse web data:</p>
      <ul>
        <li>Sending HTTP requests with <code>requests</code></li>
        <li>Parsing HTML with <code>BeautifulSoup</code></li>
        <li>Extracting and processing data</li>
      </ul>
      <h3>Tip of the day:</h3>
      <p>Be mindful of website terms of service when scraping.</p>
      <h3>Mini Project:</h3>
      <p>Create a web scraper that collects headlines from a news website.</p>
    `
  },
  {
    day: 18,
    subject: "Data Analysis with Pandas",
    content: `
      <h2>Day 18: Introduction to Pandas</h2>
      <p>Dive into data analysis using the Pandas library:</p>
      <ul>
        <li>Loading datasets</li>
        <li>Data manipulation and cleaning</li>
        <li>Basic analysis operations</li>
      </ul>
      <h3>Tip of the day:</h3>
      <p>Use Pandas DataFrames for efficient data analysis and visualization.</p>
      <h3>Mini Project:</h3>
      <p>Create a script that reads a CSV file and outputs summary statistics.</p>
    `
  },
  {
    day: 19,
    subject: "Working with APIs",
    content: `
      <h2>Day 19: Interacting with APIs</h2>
      <p>Learn how to consume APIs for dynamic data:</p>
      <ul>
        <li>Sending requests to REST APIs</li>
        <li>Parsing JSON responses</li>
        <li>Handling API errors</li>
      </ul>
      <h3>Tip of the day:</h3>
      <p>Use the <code>json()</code> method of <code>requests</code> to parse API responses.</p>
      <h3>Mini Project:</h3>
      <p>Create a program that fetches weather data from a public API and displays it.</p>
    `
  },
  {
    day: 20,
    subject: "GUI Programming with Tkinter",
    content: `
      <h2>Day 20: Building GUIs with Tkinter</h2>
      <p>Discover how to create desktop applications using Tkinter:</p>
      <ul>
        <li>Basic widgets and layout</li>
        <li>Event handling</li>
        <li>Styling and themes</li>
      </ul>
      <h3>Tip of the day:</h3>
      <p>Keep your GUI simple and user-friendly.</p>
      <h3>Mini Project:</h3>
      <p>Create a simple GUI-based calculator using Tkinter.</p>
    `
  },
  {
    day: 21,
    subject: "Introduction to Web Frameworks (Flask)",
    content: `
      <h2>Day 21: Web Development with Flask</h2>
      <p>Step into web development with a lightweight framework:</p>
      <ul>
        <li>Setting up a Flask project</li>
        <li>Routing and templates</li>
        <li>Handling forms and requests</li>
      </ul>
      <h3>Tip of the day:</h3>
      <p>Start small and gradually add features to your web app.</p>
      <h3>Mini Project:</h3>
      <p>Create a simple blog with a home page and a page for new posts.</p>
    `
  },
  {
    day: 22,
    subject: "Testing with unittest",
    content: `
      <h2>Day 22: Writing Tests with unittest</h2>
      <p>Improve code quality with Python's built-in testing framework:</p>
      <ul>
        <li>Creating test cases</li>
        <li>Using assertions</li>
        <li>Running tests</li>
      </ul>
      <h3>Tip of the day:</h3>
      <p>Write tests as you code to catch errors early.</p>
      <h3>Mini Project:</h3>
      <p>Create a set of unit tests for a simple calculator module.</p>
    `
  },
  {
    day: 23,
    subject: "Regular Expressions",
    content: `
      <h2>Day 23: Mastering Regular Expressions</h2>
      <p>Learn to use regex for pattern matching in text:</p>
      <ul>
        <li>Basic regex syntax</li>
        <li>Searching and replacing text</li>
        <li>Validating input formats</li>
      </ul>
      <h3>Tip of the day:</h3>
      <p>Use online regex testers to experiment with patterns.</p>
      <h3>Mini Project:</h3>
      <p>Create a program that validates email addresses using regular expressions.</p>
    `
  },
  {
    day: 24,
    subject: "Async Programming with asyncio",
    content: `
      <h2>Day 24: Asynchronous Programming</h2>
      <p>Harness the power of async to improve performance:</p>
      <ul>
        <li>Understanding async and await</li>
        <li>Creating asynchronous functions</li>
        <li>Running coroutines concurrently</li>
      </ul>
      <h3>Tip of the day:</h3>
      <p>Asynchronous programming can help manage I/O-bound tasks efficiently.</p>
      <h3>Mini Project:</h3>
      <p>Create a program that fetches data from multiple URLs concurrently using asyncio.</p>
    `
  },
  {
    day: 25,
    subject: "Multi-threading and Multi-processing",
    content: `
      <h2>Day 25: Concurrency in Python</h2>
      <p>Explore parallelism with threads and processes:</p>
      <ul>
        <li>Understanding threading</li>
        <li>Using the multiprocessing module</li>
        <li>When to use each approach</li>
      </ul>
      <h3>Tip of the day:</h3>
      <p>Use multi-processing to bypass the Global Interpreter Lock (GIL) for CPU-bound tasks.</p>
      <h3>Mini Project:</h3>
      <p>Create a program that performs a CPU-intensive task both sequentially and concurrently, then compare performance.</p>
    `
  },
  {
    day: 26,
    subject: "Advanced File Handling (CSV, JSON)",
    content: `
      <h2>Day 26: Working with CSV and JSON</h2>
      <p>Learn how to work with common data formats in Python:</p>
      <ul>
        <li>Reading and writing CSV files</li>
        <li>Handling JSON data</li>
        <li>Data conversion between formats</li>
      </ul>
      <h3>Tip of the day:</h3>
      <p>Use Python's <code>csv</code> and <code>json</code> modules to handle data effortlessly.</p>
      <h3>Mini Project:</h3>
      <p>Create a program that reads a CSV file, converts the data to JSON, and writes it to a new file.</p>
    `
  },
  {
    day: 27,
    subject: "Logging and Debugging",
    content: `
      <h2>Day 27: Effective Logging and Debugging</h2>
      <p>Improve your development process with logging and debugging tools:</p>
      <ul>
        <li>Using the logging module</li>
        <li>Setting log levels</li>
        <li>Debugging techniques</li>
      </ul>
      <h3>Tip of the day:</h3>
      <p>Replace print statements with proper logging for better production code.</p>
      <h3>Mini Project:</h3>
      <p>Create a script that logs events at various levels (INFO, DEBUG, ERROR) during execution.</p>
    `
  },
  {
    day: 28,
    subject: "Packaging and Distributing Python Apps",
    content: `
      <h2>Day 28: Packaging Your Python Project</h2>
      <p>Learn how to package and distribute your code:</p>
      <ul>
        <li>Creating setup.py files</li>
        <li>Building distributions</li>
        <li>Uploading to PyPI</li>
      </ul>
      <h3>Tip of the day:</h3>
      <p>Follow best practices to create clean, reusable packages.</p>
      <h3>Mini Project:</h3>
      <p>Create a distributable package from one of your small projects and document its usage.</p>
    `
  },
  {
    day: 29,
    subject: "Debugging and Profiling Performance",
    content: `
      <h2>Day 29: Debugging and Profiling</h2>
      <p>Dive into performance analysis and debugging:</p>
      <ul>
        <li>Using pdb for debugging</li>
        <li>Profiling your code with cProfile</li>
        <li>Identifying bottlenecks</li>
      </ul>
      <h3>Tip of the day:</h3>
      <p>Profiling helps you pinpoint the parts of your code that need optimization.</p>
      <h3>Mini Project:</h3>
      <p>Create a sample program, introduce an intentional bottleneck, and then optimize it based on profiling results.</p>
    `
  },
  {
    day: 30,
    subject: "Building Your Python Portfolio",
    content: `
      <h2>Day 30: Building Your Python Portfolio</h2>
      <p>Congratulations on completing 30 Days of Python!</p>
      <ul>
        <li>Create a portfolio of your projects</li>
        <li>Showcase your skills with well-documented code</li>
        <li>Share your journey with the community</li>
      </ul>
      <h3>Tip of the day:</h3>
      <p>Keep learning and updating your portfolio with new projects and techniques.</p>
      <h3>Final Project:</h3>
      <p>Create a GitHub repository that showcases all your mini projects and write a README detailing your learning journey.</p>
    `
  }
];

export function getTipForDay(day: number): DailyTip | null {
  if (day < 1 || day > 30) return null;
  return dailyTips.find(tip => tip.day === day) || null;
}