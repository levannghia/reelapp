import React, { createContext, FC } from "react";
import { Animated } from "react-native";

interface UploadContextType {
    isUpload: boolean;
    loadingMessage: string | null;
    uploading: boolean;
    uploadProgress: number;
    startUpload: (thumb_uri: string, file_uri: string, caption: string) => void;
    uploadAnimation: Animated.Value;
    showUpload: (value: boolean) => void;
    thumbnailUri: string;
}

const defaultContext: UploadContextType = {
    isUpload: false,
    loadingMessage: null,
    uploadProgress: 0,
    startUpload: () => {},
    uploading: false,
    showUpload: () => {},
    uploadAnimation: new Animated.Value(0),
    thumbnailUri: '',
}

const UploadContext = createContext<UploadContextType>(defaultContext);

export const UploadProvider: FC<{children: React.ReactNode}> = ({children}) => {
    return (
        <UploadContext.Provider>
            
        </UploadContext.Provider>
    )
}