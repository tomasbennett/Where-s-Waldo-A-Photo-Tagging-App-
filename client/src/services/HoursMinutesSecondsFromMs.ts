export function HoursMinutesSecondsFromMs(timeInMs: number): {
    hours: number,
    minutes: number,
    seconds: number
} {
    const hours = Math.floor(timeInMs / (1000 * 60 * 60));
    const minutes = Math.floor((timeInMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeInMs % (1000 * 60)) / 1000);

    return {
        hours,
        minutes,
        seconds
    }

}