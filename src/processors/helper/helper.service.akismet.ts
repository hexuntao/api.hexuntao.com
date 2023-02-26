/**
 * @file Akismet service
 * @module processor/helper/akismet.service

 */

import { AkismetClient } from 'akismet-api'
import { Injectable } from '@nestjs/common'
import { UNDEFINED } from '@app/constants/value.constant'
import { getMessageFromNormalError } from '@app/transformers/error.transformer'
import * as APP_CONFIG from '@app/app.config'
import logger from '@app/utils/logger'

const log = logger.scope('Akismet')

export enum AkismetAction {
  CheckSpam = 'checkSpam',
  SubmitSpam = 'submitSpam',
  SubmitHam = 'submitHam',
}

// https://github.com/chrisfosterelli/akismet-api/blob/master/docs/comments.md
export interface AkismetPayload {
  user_ip: string
  user_agent: string
  referrer: string
  permalink?: string | null
  comment_type?: 'comment' | 'reply'
  comment_author?: string | null
  comment_author_email?: string | null
  comment_author_url?: string | null
  comment_content?: string | null
}

@Injectable()
export class AkismetService {
  private client: AkismetClient
  private clientIsValid = false

  constructor() {
    // this.initClient()
    // this.initVerify()
  }

  private initClient(): void {
    // https://github.com/chrisfosterelli/akismet-api
    this.client = new AkismetClient({
      key: APP_CONFIG.AKISMET.key as string,
      blog: APP_CONFIG.AKISMET.blog as string,
    })
  }

  private initVerify(): void {
    this.client
      .verifyKey()
      .then((valid) => (valid ? Promise.resolve(valid) : Promise.reject('Invalid Akismet key')))
      .then(() => {
        this.clientIsValid = true
        log.info('client init succeed.')
      })
      .catch((error) => {
        this.clientIsValid = false
        log.error('client init failed!', getMessageFromNormalError(error))
      })
  }

  private makeInterceptor(handleType: AkismetAction) {
    return (content: AkismetPayload): Promise<any> => {
      return new Promise((resolve, reject) => {
        // continue operation only when initialization successful
        if (this.clientIsValid === false) {
          const message = `${handleType} failed! reason: init failed`
          log.warn(message)
          return resolve(message)
        }

        log.info(`${handleType}...`, new Date())
        this.client[handleType]({
          ...content,
          permalink: content.permalink || UNDEFINED,
          comment_author: content.comment_author || UNDEFINED,
          comment_author_email: content.comment_author_email || UNDEFINED,
          comment_author_url: content.comment_author_url || UNDEFINED,
          comment_content: content.comment_content || UNDEFINED,
        })
          .then((result) => {
            if (handleType === AkismetAction.CheckSpam && result) {
              log.warn(`${handleType} found SPAM!`, new Date(), content)
              reject('SPAM!')
            } else {
              log.info(`${handleType} succeed.`)
              resolve(result)
            }
          })
          .catch((error) => {
            const message = `${handleType} failed!`
            log.error(message, error)
            reject(message)
          })
      })
    }
  }

  public checkSpam(payload: AkismetPayload): Promise<any> {
    return this.makeInterceptor(AkismetAction.CheckSpam)(payload)
  }

  public submitSpam(payload: AkismetPayload): Promise<any> {
    return this.makeInterceptor(AkismetAction.SubmitSpam)(payload)
  }

  public submitHam(payload: AkismetPayload): Promise<any> {
    return this.makeInterceptor(AkismetAction.SubmitHam)(payload)
  }
}
