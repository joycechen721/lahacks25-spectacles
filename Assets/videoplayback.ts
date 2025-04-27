@component
export class NewScript extends BaseScriptComponent {
    @input
    movie: Texture;

    //@input Asset.Texture movie // Single input for the texture
    // Explicitly define the movie property

    // Method to seek to a specific time
    seekVideo(seekTime: number) {
        var provider = this.movie.control as VideoTextureProvider; // Cast to VideoTextureProvider
        if (provider && provider.seek) {
            provider.seek(seekTime);
            print("Video resumed from " + seekTime + " seconds");
        } else {
            print("Video control not available or seek method is not supported");
        }
    }

    // Method to play the video
    playVideo(loops: number) {
        var provider = this.movie.control as VideoTextureProvider; // Cast to VideoTextureProvider
        if (provider && provider.play) {
            provider.play(loops);
            print("Video is playing in a loop " + loops + " times");
        } else {
            print("Video control not available or play method is not supported");
        }
    }

    // Method to pause the video
    pauseVideo() {
        var provider = this.movie.control as VideoTextureProvider; // Cast to VideoTextureProvider
        if (provider && provider.pause) {
            provider.pause();
            print("Video paused");
        } else {
            print("Video control not available or pause method is not supported");
        }
    }

    // Method to resume the video
    resumeVideo() {
        var provider = this.movie.control as VideoTextureProvider; // Cast to VideoTextureProvider
        if (provider && provider.resume) {
            provider.resume();
            print("Video resumed");
        } else {
            print("Video control not available or resume method is not supported");
        }
    }

    // Method to adjust playback settings
    adjustPlayback(volume?: number, playbackRate?: number) {
        var provider = this.movie.control as VideoTextureProvider; // Cast to VideoTextureProvider
        if (provider) {
            if (volume !== undefined && provider.volume !== undefined) {
                provider.volume = volume;
                print("Volume set to " + volume);
            }
            if (playbackRate !== undefined && provider.playbackRate !== undefined) {
                provider.playbackRate = playbackRate;
                print("Playback rate set to " + playbackRate);
            }
        } else {
            print("Video control not available");
        }
    }

    // Example usage in onAwake
    onAwake() {
        this.seekVideo(5.0); // Seek to 5 seconds
        this.playVideo(3); // Play the video in a loop 3 times
        this.adjustPlayback(0.5, 1.5); // Set volume and playback rate
    }
}