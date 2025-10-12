export type Link = {
    title: string,
    url: string,
    label?: string
}

export type Project = {
    number: string | number,
    title: string,
    url: string,
    description: string,
    image: string,
    tags: string[],
    created: `${string}/${string}/${number}`
}