export function TimeFormatter(hours: number, minutes: number, seconds: number): string {

    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    return formattedTime;

}