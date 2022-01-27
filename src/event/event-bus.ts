export abstract class EventBus {
  abstract on(eventName: string, callback: (...data:any) => void): void
  abstract off(eventName: string, callback?: (...data:any) => void): void
  abstract emit(eventName: string, ...data: any): void
}
