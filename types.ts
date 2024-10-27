interface Dream {
    id: string;
    text: string;
    date: string | undefined;
    isLucid: boolean;
    hashtags: string[];
    location: string;
    characters: string;
    emotion: string;
    intensity: number;
    clarity: number;
    sleepQuality: number;
}