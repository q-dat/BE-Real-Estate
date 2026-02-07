export async function runWithConcurrency<T>(
  tasks: Array<() => Promise<T>>,
  limit: number
): Promise<T[]> {
  const results: T[] = []
  const executing: Promise<void>[] = []

  for (const task of tasks) {
    const p = task().then((res) => {
      results.push(res)
    })

    executing.push(p)

    if (executing.length >= limit) {
      await Promise.race(executing)
      executing.splice(
        executing.findIndex((e) => e === p),
        1
      )
    }
  }

  await Promise.all(executing)
  return results
}
