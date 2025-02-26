import {SheetDefinition, registerSheet} from 'react-native-actions-sheet'
import LikeSheet from './LikeSheet'

registerSheet('like-sheet', LikeSheet)

declare module 'react-native-actions-sheet' {
    interface Sheets {
        'like-sheet': SheetDefinition<{
            payload: {
                type: 'reply' | 'comment' | 'reel';
                entityId: string
            }
        }>
    }
}

export {}