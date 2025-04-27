import {validate} from "../../Utils/validate"
import {Interactable} from "../Interaction/Interactable/Interactable"
import {ToggleButton} from "../UI/ToggleButton/ToggleButton"

/**
 * This class provides visual feedback for a {@link ToggleButton} by changing the material of the provided {@link RenderMeshVisual}s when the button is toggled on or off.
 */
@component
export class Timer extends BaseScriptComponent {
  @input 
  timerText: Text
  @input
  toggledOffMaterial!: Material
  @input
  toggledOffSelectMaterial!: Material
  @input
  toggledOnMaterial!: Material
  @input
  toggledOnSelectMaterial!: Material
  @input
  disabledMaterial!: Material
  @input
  meshVisuals: RenderMeshVisual[] = []

  private toggleButton: ToggleButton | null = null
  private interactable: Interactable | null = null

  private materials: Material[] = []
    
  private voiceMLModule: VoiceMLModule = require("LensStudio:VoiceMLModule");
  private listeningOptions: VoiceML.ListeningOptions;
  private onListenUpdate: (eventData: VoiceML.ListeningUpdateEventArgs) => void;
  private eventRegistration: any;

  
  onAwake(): void {
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
          // check if the transcription is a number
          const parsedNumber = this.extractNumber(eventData.transcription);

          if (parsedNumber != 0) {
            print(`Parsed Number: ${parsedNumber}`);
          // } else {
            this.voiceMLModule.stopListening();
            if (this.eventRegistration) {
              this.voiceMLModule.onListeningUpdate.remove(this.eventRegistration);
              this.eventRegistration = null;
            }
            // this.toggleButton.enabled = false;
            this.startCountdownTimer(parsedNumber * 60);
          } else {
            print("Not a number")
          }
      }
    };
        
    this.materials = [
      this.toggledOffMaterial,
      this.toggledOffSelectMaterial,
      this.toggledOnMaterial,
      this.toggledOnSelectMaterial,
      this.disabledMaterial,
    ]

    this.defineScriptEvents()
  }

  private getTime(timeInSeconds: number): string {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  private startCountdownTimer(time: number) {
    // start the timer
    print("WE ARE HERE")
    // this.timerText.text = `Timer started for ` + time + ` seconds`;
    // count down
    let countdown = time;
    this.createEvent("UpdateEvent").bind(() => {
      if (countdown > 0) {
        countdown -= getDeltaTime();
        let hi = this.getTime(Math.floor(countdown))
        this.timerText.text = hi;
      } else {
        this.timerText.text = "Timer ended";
        // this.toggleButton.enabled = false;
      }
    });
  }

  private defineScriptEvents() {
    this.createEvent("OnStartEvent").bind(() => {
      this.init()
    })
  }

  init(): void {
    this.toggleButton = this.getSceneObject().getComponent(
      ToggleButton.getTypeName(),
    )

    this.interactable = this.getSceneObject().getComponent(
      Interactable.getTypeName(),
    )

    if (this.interactable === null || this.interactable === undefined) {
      throw new Error(
        "UIToggleButtonCustomize script requires an Interactable on the ToggleButton",
      )
    }

    this.setupInteractableCallbacks(this.interactable)
  }

  private removeMaterials(): void {
    for (let i = 0; i < this.meshVisuals.length; i++) {
      let materials = []

      const matCount = this.meshVisuals[i].getMaterialsCount()

      for (let k = 0; k < matCount; k++) {
        const material = this.meshVisuals[i].getMaterial(k)

        if (this.materials.includes(material)) {
          continue
        }

        materials.push(material)
      }

      this.meshVisuals[i].clearMaterials()

      for (var k = 0; k < materials.length; k++) {
        this.meshVisuals[i].addMaterial(materials[k])
      }
    }
  }

  // Changes the material of each RenderMeshVisual provided.
  private changeMeshes(material: Material | undefined): void {
    validate(material)

    this.removeMaterials()

    this.meshVisuals.forEach((mesh) => {
      mesh.addMaterial(material)
    })
  }

  /**
   * Changes the materials depending on the {@link ToggleButton}'s status.
   * @param materialOn - The material to be used if on.
   * @param materialOff - The material to be used if off.
   */
  private changeToggleOnMesh(
    materialOn: Material | undefined,
    materialOff: Material | undefined,
  ) {
    validate(this.toggleButton)
    this.changeMeshes(this.toggleButton.isToggledOn ? materialOn : materialOff)
  }

  // Sets up interactable callbacks.
  setupInteractableCallbacks(interactable: Interactable): void {
    validate(this.toggleButton)

    interactable.onTriggerStart.add(() => {
      this.changeToggleOnMesh(
        this.toggledOnSelectMaterial,
        this.toggledOffSelectMaterial,
      )
    })

    interactable.onTriggerCanceled.add(() => {
      this.changeToggleOnMesh(this.toggledOnMaterial, this.toggledOffMaterial)
    })

    this.toggleButton.createEvent("OnEnableEvent").bind(() => {
      this.changeToggleOnMesh(this.toggledOnMaterial, this.toggledOffMaterial)
    })

    this.toggleButton.createEvent("OnDisableEvent").bind(() => {
      this.changeMeshes(this.disabledMaterial)
    })

    this.toggleButton.onStateChanged.add((isToggledOn) => {
      if (this.toggleButton?.enabled === false) {
        this.changeMeshes(this.disabledMaterial)
        return
      }

      this.changeMeshes(
        isToggledOn ? this.toggledOnMaterial : this.toggledOffMaterial,
      )
            
      if (isToggledOn) {
        print("Toggle button is on");
        this.voiceMLModule.startListening(this.listeningOptions);
        this.eventRegistration = this.voiceMLModule.onListeningUpdate.add(this.onListenUpdate);
        this.voiceMLModule.onListeningError.add((eventErrorArgs: VoiceML.ListeningErrorEventArgs) => {
          print(`Listening Error: ${eventErrorArgs.error}, Description: ${eventErrorArgs.description}`);
      });
      } else {
        print("Toggle button is off");
        this.voiceMLModule.stopListening();
        if (this.eventRegistration) {
          this.voiceMLModule.onListeningUpdate.remove(this.eventRegistration);
          this.eventRegistration = null;
        }
      }
            
    })
  }

  private extractNumber(text: string): number {
    // Convert words to numbers (e.g., "five" to 5)
    const wordToNumber = {
        "zero": 0, "one": 1, "two": 2, "three": 3, "four": 4, 
        "five": 5, "six": 6, "seven": 7, "eight": 8, "nine": 9,
        "ten": 10, "eleven": 11, "twelve": 12, "thirteen": 13, "fourteen": 14,
        "fifteen": 15, "sixteen": 16, "seventeen": 17, "eighteen": 18, "nineteen": 19,
        "twenty": 20, "thirty": 30, "forty": 40, "fifty": 50, 
        "sixty": 60, "seventy": 70, "eighty": 80, "ninety": 90
    };
    
    // Normalize the text
    const normalizedText = text.toLowerCase().trim();
    
    // First, try to extract a simple number like "15" or "60"
    const numericMatches = normalizedText.match(/\d+/);
    if (numericMatches) {
        return parseInt(numericMatches[0]);
    }
    
    // If no numeric match, try to match words
    for (const word in wordToNumber) {
        if (normalizedText.includes(word)) {
            return wordToNumber[word];
        }
    }
    
    // Check for compound numbers like "twenty five"
    for (const tens in ["twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]) {
        if (normalizedText.includes(tens)) {
            for (const digit of ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]) {
                if (normalizedText.includes(`${tens} ${digit}`)) {
                    return wordToNumber[tens] + wordToNumber[digit];
                }
            }
            return wordToNumber[tens];
        }
    }
    
    // No match found
    return 0;
}

}

