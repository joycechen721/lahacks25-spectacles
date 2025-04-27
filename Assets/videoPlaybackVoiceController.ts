import { NewScript } from "./videoplayback";

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
            let seekTime = 10.0;
            // const timeMatches = command.match(/\d+/);
            // if (timeMatches && timeMatches.length > 0) {
                // seekTime = parseInt(timeMatches[0]);
                this.videoController.seekVideo(seekTime);
                print(`Seeking ${seekTime} seconds`);
            // } else {
            //     print("No valid time found in seek command");
            // }
        } else if (command.includes("previous") || command.includes("back")) {
            let seekTime = -10.0;
            // const timeMatches = command.match(/\d+/);
            // if (timeMatches && timeMatches.length > 0) {
                // seekTime = parseInt(timeMatches[0]);
                this.videoController.seekVideo(seekTime);
                print(`Seeking ${seekTime} seconds`);
            // } else {
            //     print("No valid time found in seek command");
            // }
        }
    }
}