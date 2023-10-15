(function (jspsych) {
    "use strict";


    const info = {
        name: 'RdkDelayed',
        description: '',
        parameters: {
            soa_motion: {
                type: jspsych.ParameterType.INT,
                pretty_name: 'SOA motion',
                default: 0,
                description: 'The duration in milliseconds before the dots start moving.'
            },
            soa_color: {
                type: jspsych.ParameterType.INT,
                pretty_name: 'SOA color',
                default: 0,
                description: 'The duration in milliseconds before the dots change color.'
            },
            motion_direction: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'Motion direction',
                default: 'up',
                description: 'The direction of dot motion.'
            },
            coherent_color: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'Color',
                default: 'blue',
                description: 'The color of the dots.'
            },
            incoherent_color: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'Color',
                default: 'red',
                description: 'The color of the dots.'
            },
            trial_duration: {
                type: jspsych.ParameterType.INT,
                pretty_name: 'Trial duration',
                default: null,
                description: 'How long to show trial before it ends.'
            },
            num_dots: {
                type: jspsych.ParameterType.INT,
                pretty_name: 'Number of dots duration',
                default: 200,
                description: 'number of dots.'
            },
            dot_radius: {
                type: jspsych.ParameterType.INT,
                pretty_name: 'Radius of the dots',
                default: 4,
                description: 'Radius of the dots.'
            },
            dot_speed: {
                type: jspsych.ParameterType.FLOAT,
                pretty_name: 'Speed of the dots.',
                default: 2,
                description: 'Speed of the dots'
            },
            motion_coherence: {
                type: jspsych.ParameterType.FLOAT,
                pretty_name: 'Motion coherence',
                default: 40,
                description: 'Percentage of dots moving in the coherent direction as opposed to random'
            },
            color_coherence: {
                type: jspsych.ParameterType.FLOAT,
                pretty_name: 'Color coherence',
                default: 65,
                description: 'Percentage of dots colored in the coherent as opposed to the incoherent color'
            },
            canvas_size: {
                type: jspsych.ParameterType.INT,
                pretty_name: 'Canvas size',
                default: 500,
                description: 'Canvas size'
            },
            choices_motion: {
                type: jspsych.ParameterType.ARRAY,
                pretty_name: 'Possible choices',
                default: [],
                description: 'possible choices',
            },
            choices_color: {
                type: jspsych.ParameterType.ARRAY,
                pretty_name: 'Possible choices',
                default: [],
                description: 'possible choices',
            },
            correct_motion: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'Correct key for motion',
                default: '',
                description: 'Correct key for motion'
            },
            correct_color: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'Correct key for color',
                default: '',
                description: 'Correct key for motion'
            },
            prompt: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'Prompt',
                default: '',
                description: 'prompt'
            }
        }
    }

    class jsPsychRdkDelayed {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
        }

        trial(display_element, trial) {
            // Create a canvas if it doesn't exist
            let canvas = document.createElement('canvas');
            display_element.appendChild(canvas);
            let prompt = document.createElement('div');
            prompt.innerHTML = trial.prompt
            display_element.appendChild(prompt)

// Apply styles to position it at the top of the screen
            prompt.style.position = 'fixed';  // Position it fixed
            prompt.style.top = '0';           // 0px from the top
            prompt.style.left = '0';          // 0px from the left
            prompt.style.width = '100%';      // Full width
            prompt.style.padding = '10px';    // Some padding

            prompt.style.textAlign = 'center';// Center the text


            let ctx = canvas.getContext('2d');
            canvas.width = 600
            canvas.height = 600

            // Define other variables such as number of dots, max radius, etc.
            // ...

            // Initialize dots
            let dots = [];
            // ... (code to initialize dots)
            let animationFrameId

            const updateDots = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                for (let i = 0; i < dots.length; i++) {
                    let dot = dots[i];
                    ctx.beginPath();
                    ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2, false);
                    ctx.fillStyle = dot.color;
                    ctx.fill();

                    // Update position
                    dot.x += dot.dx;
                    dot.y += dot.dy;

                    // Handle boundary collision
                    if (dot.x > canvas.width) {
                        dot.x -= canvas.width
                    } else if (dot.x < 0) {
                        dot.x += canvas.width
                    }
                    if (dot.y > canvas.height) {
                        dot.y -= canvas.height

                    } else if (dot.y < 0) {
                        dot.y += canvas.height
                    }
                }

                animationFrameId = requestAnimationFrame(updateDots);
            }

            // Function to start RDK after a delay
            const startRDKDelayed = () => {
                for (let i = 0; i < trial.num_dots; i++) {
                    let dot = {
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        radius: trial.dot_radius,

                        color: 'black' // Initial color
                    };
                    let dx = Math.random() * 2 - 1
                    let dy = Math.random() * 2 - 1
                    let vel = normalizedVector(dx, dy, trial.dot_speed)
                    // Override direction for 40% of the dots
                    dot.dx = vel.x + (Math.random() * -1) * trial.dot_speed / 10
                    dot.dy = vel.y + (Math.random() * -1) * trial.dot_speed / 10
                    dots.push(dot);
                }

                // Delay motion
                setTimeout(() => {
                    shuffleArray(dots)
                    for (let i = 0; i < trial.num_dots * trial.motion_coherence / 100; i++) {
                        if (trial.motion_direction === 'up') {
                            dots[i].dy = -trial.dot_speed + (Math.random() * -1) * trial.dot_speed / 10
                            dots[i].dx = 0
                        } else {
                            dots[i].dy = trial.dot_speed + (Math.random() * -1) * trial.dot_speed / 10
                            dots[i].dx = 0
                        }
                    }
                }, trial.soa_motion);

                // Delay color change
                setTimeout(() => {
                    shuffleArray(dots)
                    let rel_num = Math.floor(trial.num_dots * trial.color_coherence / 100)
                    for (let i = 0; i < rel_num; i++) {
                        dots[i].color = trial.coherent_color
                    }
                    for (let i = rel_num; i < trial.num_dots; i++) {
                        dots[i].color = trial.incoherent_color
                    }
                }, trial.soa_color);

                // Start updating the dots for the animation frame

                animationFrameId = requestAnimationFrame(updateDots);
            };

            // Optionally, hide the RDK initially until the delay is over
            if (trial.hide_initially) {
                canvas.style.visibility = 'hidden';
            }
            let keyboardListener;
            var response = {
                rt: -1,
                key: "",
            };

            let timeoutId;

            // Function to handle responses, stopping the trial
            const after_response = (info) => {

                if (info === undefined) {
                    info = {
                        key: "",
                        rt: -1
                    }
                }
                if (timeoutId !== undefined && timeoutId !== null) {
                    clearTimeout(timeoutId)
                }
                if (keyboardListener !== undefined && keyboardListener !== null) {
                    this.jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
                }
                if (animationFrameId !== undefined && animationFrameId !== null) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null
                }
                let correct = false
                let tooEarly = false
                if (info.key === trial.correct_motion && info.rt >= trial.soa_motion) {
                    if (info.rt >= trial.soa_motion) {
                        correct = true
                    } else {
                        tooEarly = true
                    }

                }
                if (info.key === trial.correct_color) {
                    if (info.rt >= trial.soa_color) {
                        correct = true
                    } else {
                        tooEarly = true
                    }
                }
                let responseTask
                if (info.key in trial.choices_color) {
                    responseTask = 'color'
                }
                if (info.key in trial.choices_motion) {
                    responseTask = 'motion'
                }

                let trial_data = {
                    key_press: info.key,
                    rt: info.rt,
                    soa_motion: trial.soa_motion,
                    soa_color: trial.soa_color,
                    motion_direction: trial.motion_direction,
                    coherent_color: trial.coherent_color,
                    incoherent_color: trial.incoherent_color,
                    trial_duration: trial.trial_duration,
                    num_dots: trial.num_dots,
                    dot_radius: trial.dot_radius,
                    dot_speed: trial.dot_speed,
                    motion_coherence: trial.motion_coherence,
                    color_coherence: trial.color_coherence,
                    canvas_size: trial.canvas_size,
                    choices_motion: trial.choices_motion,
                    choices_color: trial.choices_color,
                    correct_key_motion: trial.correct_motion,
                    correct_key_color: trial.correct_color,
                    correct: correct,
                    tooEarly: tooEarly,
                    responseTask: responseTask
                };
                display_element.innerHTML = ''
                // End trial when response is recorded
                this.jsPsych.finishTrial(trial_data);
            };


            // Start RDK after delay
            startRDKDelayed();


            // Set up the event listener for responses
            if (trial.trial_duration !== null) {
                timeoutId = this.jsPsych.pluginAPI.setTimeout(() => {
                    after_response(); // you might want to send some info here
                }, trial.trial_duration);
            }
            let choices = [...trial.choices_color, ...trial.choices_motion]
            const startKeyboardListener = () => {
                //Start the response listener if there are choices for keys
                if (choices != []) {
                    //Create the keyboard listener to listen for subjects' key response
                    keyboardListener = this.jsPsych.pluginAPI.getKeyboardResponse({
                        callback_function: after_response, //Function to call once the subject presses a valid key
                        valid_responses: choices, //The keys that will be considered a valid response and cause the callback function to be called
                        rt_method: "performance", //The type of method to record timing information.
                        persist: false, //If set to false, keyboard listener will only trigger the first time a valid key is pressed. If set to true, it has to be explicitly cancelled by the cancelKeyboardResponse plugin API.
                        allow_held_key: false, //Only register the key once, after this getKeyboardResponse function is called. (Check JsPsych docs for better info under 'jsPsych.pluginAPI.getKeyboardResponse').
                    });
                }
            };
            startKeyboardListener()

            // ... (code for setting up other event listeners if needed)
        }
    }

    jsPsychRdkDelayed.info = info;

    window.jsPsychRdkDelayed = jsPsychRdkDelayed
})(jsPsychModule);

function normalizedVector(x, y, sqrLength) {
    while (x == 0 && y == 0) {
        x = Math.random() * 2 - 1
        y = Math.random() * 2 - 1
    }
    const dist = Math.sqrt(x * x + y * y)
    return {x: x * sqrLength / dist, y: y * sqrLength / dist}

}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
        // swap elements array[i] and array[j]
        // we use "destructuring assignment" syntax to achieve that
        [array[i], array[j]] = [array[j], array[i]];
    }
}
