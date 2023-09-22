import axios, { AxiosInstance } from 'axios'
import { Prompt } from './types/prompt'

export const api = axios.create({
  baseURL: 'http://localhost:3333'
})

export class Client {
  private axios: AxiosInstance

  constructor () {
    this.axios = axios.create({
      baseURL: 'http://localhost:3333'
    })
  }

  async getPrompts(): Promise<Prompt[]> {
    return (await this.axios.get('/prompts')).data
  }
}
