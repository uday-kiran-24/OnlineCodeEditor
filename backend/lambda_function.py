import sys
import io
import subprocess

def execute_java_code(code):
    try:
        print('this is the code that we have received', code)
        
        # Create a temporary Java source file
        with open('/tmp/Main.java', 'w') as java_file:
            java_file.write(code)
        
        # Compile the Java source file
        compile_result = subprocess.run(
            ['javac', '/tmp/Main.java'], stdout=subprocess.PIPE, stderr=subprocess.PIPE
        )
        
        print('Compilation result:', compile_result.returncode)
        if compile_result.returncode != 0:
            # Compilation failed, return the error message
            return compile_result.stderr.decode()
        
        # Run the compiled Java code
        run_result = subprocess.run(
            ['java', '-classpath', '/tmp', 'Main'], stdout=subprocess.PIPE, stderr=subprocess.PIPE
        )
        
        print('Run result:', run_result.returncode)
        return run_result.stdout.decode()
    except Exception as e:
        return str(e)

def execute_python_code(code):
    # Execute Python code and capture the output
    original_stdout = sys.stdout
    sys.stdout = output_capture = io.StringIO()  # Redirect standard output
    try:
        exec(code)  # Use exec() to capture print output
        output = output_capture.getvalue()  # Get the captured output
        print('out of the code', output)
        return output
    except Exception as e:
        return str(e)
    finally:
        sys.stdout = original_stdout



def execute_cpp_code(code):
    try:
        print('This is the code that we have received:\n', code)
        
        # Create a temporary C++ source file
        with open('/tmp/temp.cpp', 'w') as cpp_file:
            cpp_file.write(code)
        
        # Compile the C++ source file
        compile_result = subprocess.run(
            ['g++', '/tmp/temp.cpp', '-o', '/tmp/temp'],
            stdout=subprocess.PIPE, stderr=subprocess.PIPE
        )
        
        print('Compilation result:', compile_result.returncode)
        if compile_result.returncode != 0:
            # Compilation failed, return the error message
            return compile_result.stderr.decode()
        
        # Run the compiled C++ code
        run_result = subprocess.run(
            ['/tmp/temp'],
            stdout=subprocess.PIPE, stderr=subprocess.PIPE
        )
        
        print('Run result:', run_result.returncode)
        return run_result.stdout.decode()
    except Exception as e:
        return str(e)


def handler(event, context):
    language = event.get('language','python')
    code = event.get('code','')
    if language=='python':
        result = execute_python_code(code)
    elif language=='java':
        result = execute_java_code(code)
    elif language=='cpp':
        result = execute_cpp_code(code)
    else:
        result = 'Unsupported Language ' + language

    return{
        'statusCode' : 200,
        'body' : result
    }