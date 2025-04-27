import { GridContentCreator } from "./SpectaclesInteractionKit/Components/UI/ScrollView/GridContentCreator";
import { NewScript } from "./videoplayback";

// Define the structure
interface CookingStep {
    step: number;
    title: string;
    start_time: number;
    end_time: number;
    text: string;
  }

// Store the data
const beefWellingtonSteps: CookingStep[] = [
{
    step: 1,
    title: "Introduction to Beef Wellington",
    start_time: 0,
    end_time: 30,
    text: "Learn about the history and popularity of Beef Wellington, a celebratory dish often enjoyed at Christmas. The video will walk through each step needed to perfect this iconic recipe. Get ready for a breakdown of all major components to ensure success."
},
{
    step: 2,
    title: "Making the Mushroom Duxelle",
    start_time: 30,
    end_time: 158,
    text: "Blitz all the mushrooms in a blender until finely chopped, working in batches to avoid overcrowding. Cook the chopped mushrooms in a large pan with olive oil and salt for about 20–30 minutes until nearly all the moisture evaporates. Stir in minced garlic and thyme, optionally deglaze with whiskey, flambe if desired, and cook further until the mixture is dry, rich, and fragrant."
},
{
    step: 3,
    title: "Making the Herb Crepes",
    start_time: 158,
    end_time: 245,
    text: "Blanch parsley, spinach, and chives briefly in boiling water, then shock them in ice water to preserve their bright green color. Blend the blanched herbs with milk until smooth, then mix into a crepe batter with eggs, butter, flour, and salt. Cook thin crepes on a lightly oiled pan until set on both sides, then set aside to cool completely."
},
{
    step: 4,
    title: "Making the Puff Pastry",
    start_time: 245,
    end_time: 393,
    text: "Prepare a basic dough by rubbing cold butter into flour and salt until sandy, then gradually mix with cold water. Chill the dough, then prepare a butter block by blending room-temperature butter with flour and shaping it into a square. Enclose the butter block with the dough, roll out, fold like a letter, and repeat multiple times with resting periods to build flaky pastry layers."
},
{
    step: 5,
    title: "Preparing the Beef Fillet",
    start_time: 393,
    end_time: 480,
    text: "Dry brine a center-cut beef fillet by seasoning it heavily with salt and refrigerating uncovered overnight. Sear the beef fillet briefly on all sides in a hot pan to achieve a golden crust. Brush the seared beef with Dijon mustard and tightly wrap it in cling film before chilling it to firm up."
},
{
    step: 6,
    title: "Assembling the Wellington",
    start_time: 480,
    end_time: 550,
    text: "Lay out herb crepes on cling film, overlapping slightly, then layer prosciutto slices to form a moisture barrier. Spread the cooled mushroom duxelle evenly over the prosciutto. Place the chilled beef fillet on top and roll everything tightly into a uniform log, sealing the edges, and chill again to maintain the shape."
},
{
    step: 7,
    title: "Wrapping in Puff Pastry",
    start_time: 550,
    end_time: 580,
    text: "Roll out the puff pastry to a quarter-inch thickness and brush with beaten egg. Unwrap the beef roll and place it at the edge of the pastry, rolling it up tightly and trimming excess pastry for a neat seam. Optionally, decorate the Wellington with a lattice of pastry on top and brush again with egg wash."
},
{
    step: 8,
    title: "Baking the Wellington",
    start_time: 580,
    end_time: 600,
    text: "Bake the Wellington in a preheated oven until the internal temperature of the beef reaches 43°C (109°F) for a perfect medium-rare. Depending on the oven and size of the beef, this will take around 40–45 minutes. Allow the Wellington to rest for at least 10 minutes after baking to set the juices."
},
{
    step: 9,
    title: "Making the Red Wine Sauce",
    start_time: 600,
    end_time: 640,
    text: "Roast bone marrow in the oven until soft, then scrape it into a saucepan. Add shallots, beef stock, red wine, and a sprig of rosemary, and simmer to reduce until thick and glossy. Finish by whisking in cold butter to make the sauce silky and rich."
},
{
    step: 10,
    title: "Serving the Beef Wellington",
    start_time: 640,
    end_time: 667,
    text: "Carve the rested Wellington carefully into thick slices, revealing the distinct layers of pastry, mushroom duxelle, and perfectly cooked beef. Spoon over the rich red wine sauce and garnish with chopped chives if desired. Serve immediately and enjoy the delicious results."
}
];


@component
export class VideoPlaybackVoiceController extends BaseScriptComponent {
    @input
    @hint("Reference to the video controller script")
    videoController: NewScript;

    @input
    @hint("Text component to display transcriptions")
    text: Text;

    @input
    @hint("Delay time (in seconds) to wait before confirming a command")
    commandDelay: number = 0.5;

    @input
    @hint("The button image component to swap icons")
    buttonImage: Image;

    @input
    @hint("Texture for the normal mic icon (listening off)")
    normalMicImage: Texture;

    @input
    @hint("Texture for the listening mic icon (listening on)")
    listeningMicImage: Texture;

    private voiceMLModule: VoiceMLModule = require("LensStudio:VoiceMLModule");
    private listeningOptions: VoiceML.ListeningOptions;
    private onListenUpdate: (eventData: VoiceML.ListeningUpdateEventArgs) => void;
    private eventRegistration: any;
    private lastTranscription: string = "";
    private commandPending: boolean = false;
    private commandTimer: number = 0;
    private isListening: boolean = false;

    curInstr: number = 0;

    coordinateNext(): void {
        if (this.curInstr + 1 >= beefWellingtonSteps.length) {
            return
        }

        this.curInstr++;

        this.getSceneObject()
            .getParent()
            .getParent()
            .getChild(6)
            .getChild(0)
            .getChild(0)
            .getChild(0)
            .getChild(0)
            .getChild(2)
            .getChild(0)
            .getComponent(GridContentCreator.getTypeName()).scrollToNextInstruction()

        this.videoController.seekVideo(beefWellingtonSteps[this.curInstr].start_time)
    }

    coordinatePrev(): void {
        if (this.curInstr - 1 < 0) {
            return
        }

        this.curInstr--;

        this.getSceneObject()
            .getParent()
            .getParent()
            .getChild(6)
            .getChild(0)
            .getChild(0)
            .getChild(0)
            .getChild(0)
            .getChild(2)
            .getChild(0)
            .getComponent(GridContentCreator.getTypeName()).scrollToPrevInstruction()

        this.videoController.seekVideo(beefWellingtonSteps[this.curInstr].start_time)
    }


    onAwake() {
        // Bind the onStart event
        this.createEvent("OnStartEvent").bind(() => {
            this.onStart();
            print("OnStart event triggered for VideoPlaybackVoiceController");
        });

        // Bind the update event (for delay tracking)
        // this.createEvent("UpdateEvent").bind(() => {
        //     this.update();
        // });

        // Setup listening options
        this.listeningOptions = VoiceML.ListeningOptions.create();
        this.listeningOptions.speechRecognizer = VoiceMLModule.SpeechRecognizer.Default;
        this.listeningOptions.shouldReturnAsrTranscription = true;
        this.listeningOptions.shouldReturnInterimAsrTranscription = true;

        // Define the onListenUpdate callback
        this.onListenUpdate = (eventData: VoiceML.ListeningUpdateEventArgs) => {
            if (eventData.transcription.trim() === "") {
                print("Transcription is empty");
                return;
            }
            print(`Transcription: ${eventData.transcription}`);

            if (eventData.isFinalTranscription) {
                print(`Final Transcription: "${eventData.transcription}"`);
                // if (this.isListening) {
                    this.text.text = eventData.transcription;
                    this.handleTranscription(eventData.transcription);
                // } else {
                //     print("Listening is disabled - ignoring transcription");
                // }
            }
        };

        // Set the initial button icon to normal mic (listening off)
        if (this.buttonImage && this.normalMicImage) {
            this.buttonImage.mainMaterial.mainPass.baseTex = this.normalMicImage;
        } else {
            print("Button image or normal mic image not assigned in inspector");
        }
    }

    onStart() {
        // Setup VoiceMLModule callbacks
        this.voiceMLModule.onListeningEnabled.add(() => {
            print("Microphone permissions granted - starting listening");
            this.voiceMLModule.startListening(this.listeningOptions);
            this.eventRegistration = this.voiceMLModule.onListeningUpdate.add(this.onListenUpdate);
        });

        this.voiceMLModule.onListeningDisabled.add(() => {
            this.voiceMLModule.stopListening();
            if (this.eventRegistration) {
                this.voiceMLModule.onListeningUpdate.remove(this.eventRegistration);
                this.eventRegistration = null;
            }
            print("Listening stopped due to permissions being revoked");
            // Reset the button icon and state when permissions are revoked
            this.isListening = false;
            if (this.buttonImage && this.normalMicImage) {
                this.buttonImage.mainMaterial.mainPass.baseTex = this.normalMicImage;
            }
        });

        this.voiceMLModule.onListeningError.add((eventErrorArgs: VoiceML.ListeningErrorEventArgs) => {
            print(`Listening Error: ${eventErrorArgs.error}, Description: ${eventErrorArgs.description}`);
        });
    }

    // Public method to toggle listening
    public toggleListening() {
        this.isListening = !this.isListening;
        if (this.isListening) {
            print("Listening toggled ON");
            if (this.buttonImage && this.listeningMicImage) {
                this.buttonImage.mainMaterial.mainPass.baseTex = this.listeningMicImage;
            }
        } else {
            print("Listening toggled OFF");
            if (this.buttonImage && this.normalMicImage) {
                this.buttonImage.mainMaterial.mainPass.baseTex = this.normalMicImage;
            }
            this.text.text = ""; // Clear the text feedback when listening is disabled
            this.commandPending = false; // Reset any pending commands
            this.lastTranscription = "";
        }
    }

    // Handle the transcription directly
    private handleTranscription(transcription: string) {
        // Normalize the transcription for comparison
        const nt = transcription.trim().toLowerCase();
        // Remove any special characters or extra spaces
        const regex = /[^a-z0-9\s]/gi;
        const normalizedText = nt.replace(regex, "").replace(/\s+/g, " ");
        print(`Normalized Transcription: "${normalizedText}"`);

        // Check for valid commands related to video playback
        if (normalizedText.includes("play")) {
            print("Detected 'play' command - starting delay");
            this.executeCommand(normalizedText);
            // this.lastTranscription = normalizedText;
            // this.commandPending = true;
            // this.commandTimer = 0;
        } else if (normalizedText.includes("pause") || normalizedText.includes("stop")) {
            print("Detected 'pause' command - starting delay");
            // execute command immediately
            this.executeCommand(normalizedText);
            // this.lastTranscription = normalizedText;
            // this.commandPending = true;
            // this.commandTimer = 0;
        } else if (normalizedText.includes("resume")) {
            print("Detected 'resume' command - starting delay");
            this.executeCommand(normalizedText);
            // this.lastTranscription = normalizedText;
            // this.commandPending = true;
            // this.commandTimer = 0;
        } else if (normalizedText.startsWith("volume") || normalizedText.includes("volume")) {
            print("Detected volume command - starting delay");
            this.executeCommand(normalizedText);
            // this.lastTranscription = normalizedText;
            // this.commandPending = true;
            // this.commandTimer = 0;
        } else if (normalizedText.startsWith("speed") || normalizedText.includes("speed")) {
            print("Detected speed command - starting delay");
            this.executeCommand(normalizedText);
            // this.lastTranscription = normalizedText;
            // this.commandPending = true;
            // this.commandTimer = 0;
        } else if (normalizedText.includes("next")) {
            print("Detected next command - starting delay");
            this.executeCommand(normalizedText);
            // this.lastTranscription = normalizedText;
            // this.commandPending = true;
            // this.commandTimer = 0;
        } else if (normalizedText.includes("previous") || normalizedText.includes("back")) {
            print("Detected previous command - starting delay");
            this.executeCommand(normalizedText);
            // this.lastTranscription = normalizedText;
            // this.commandPending = true;
            // this.commandTimer = 0;
        } else {
            print(`Transcription "${transcription}" does not match any commands`);
            // this.commandPending = false; // Reset if the transcription doesn't match
        }
    }

    // Update method to handle the delay
    private update() {
        if (!this.commandPending) return;

        this.commandTimer += getDeltaTime();
        print(`Command delay timer: ${this.commandTimer.toFixed(2)} seconds`);

        if (this.commandTimer >= this.commandDelay) {
            // Check if the text is still the same after the delay
            const currentText = this.text.text.trim().toLowerCase();
            if (currentText.includes(this.lastTranscription)) {
                print(`Command "${this.lastTranscription}" confirmed after delay`);
                if (this.isListening && this.videoController) {
                    this.executeCommand(currentText);
                } else {
                    print("Listening is disabled or video controller not found - ignoring command execution");
                }
            } else {
                print(`Command "${this.lastTranscription}" changed to "${currentText}" during delay - ignoring`);
            }
            this.commandPending = false;
            this.lastTranscription = "";
        }
    }
    
    // Execute the video control commands
    private executeCommand(command: string) {
        if (!this.videoController) {
            print("Video controller not available");
            return;
        }

        if (command.includes("play") || command.includes("resume")) {
            this.videoController.resumeVideo(); // Play once
            print("Playing video");
        } else if (command.includes("pause") || command.includes("stop")) {
            this.videoController.pauseVideo();
            print("Pausing video");
        } else if (command.includes("volume")) {
            // Extract volume level - look for numbers or words like "high", "low", "medium"
            let volumeLevel = 0.5; // Default to medium volume
            
            if (command.includes("high") || command.includes("up") || command.includes("increase")) {
                volumeLevel = 1.0;
            } else if (command.includes("low") || command.includes("down") || command.includes("decrease")) {
                volumeLevel = 0.2;
            } else if (command.includes("medium") || command.includes("normal")) {
                volumeLevel = 0.5;
            } else {
                // Try to extract a number
                const matches = command.match(/\d+/);
                if (matches && matches.length > 0) {
                    const num = parseInt(matches[0]);
                    if (num >= 0 && num <= 100) {
                        volumeLevel = num / 100; // Convert percentage to 0-1 scale
                    }
                }
            }
            
            this.videoController.adjustPlayback(volumeLevel, undefined);
            print(`Adjusting volume to ${volumeLevel}`);
        } else if (command.includes("speed")) {
            // Extract speed level
            let speedLevel = 1.0; // Default to normal speed
            
            if (command.includes("fast") || command.includes("faster") || command.includes("increase")) {
                speedLevel = 5;
            } else if (command.includes("slow") || command.includes("slower") || command.includes("decrease")) {
                speedLevel = 0.5;
            } else if (command.includes("normal") || command.includes("regular")) {
                speedLevel = 1.0;
            } else {
                // Try to extract a number
                const matches = command.match(/\d+(\.\d+)?/);
                if (matches && matches.length > 0) {
                    const num = parseFloat(matches[0]);
                    if (num >= 0.1 && num <= 3.0) {
                        speedLevel = num;
                    }
                }
            }
            
            this.videoController.adjustPlayback(undefined, speedLevel);
            print(`Adjusting speed to ${speedLevel}x`);
        } else if (command.includes("next")) {
            this.coordinateNext()
        } else if (command.includes("previous") || command.includes("back")) {
            this.coordinatePrev()
        }
    }
}