import React from 'react'
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface MyCardProps {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    content?: string | React.ReactNode;
    footer?: string | React.ReactNode;
}


const CardTemplete: React.FC<MyCardProps> =
    ({ title,
        description,
        icon,
        content,
        footer, }) => {
        return (
            <Card
                className="
        w-full h-full max-w-md mx-auto 
        rounded-lg border transition-all duration-200 cursor-pointer

        /* Light Mode */
        bg-white text-gray-900 border-gray-200 shadow-sm 
        hover:shadow-md hover:border-blue-400 hover:-translate-y-1

        /* Dark Mode */
        dark:bg-gray-800 dark:text-white dark:border-gray-700 
        dark:hover:border-blue-500 dark:hover:shadow-lg
    "
            >
                <CardHeader className="flex justify-between items-center px-4">
                    <div>
                        <CardTitle className="text-2xl font-semibold">
                            {title}
                        </CardTitle>

                        {description && (
                            <CardDescription className="text-gray-500 dark:text-gray-400 text-sm">
                                {description}
                            </CardDescription>
                        )}
                    </div>

                    {icon && (
                        <div className="transition-colors hover:text-blue-500 dark:hover:text-blue-300">
                            <CardAction>
                                {icon}
                            </CardAction>
                        </div>
                    )}
                </CardHeader>

                <CardContent className="px-4 text-3xl font-bold">
                    {content}
                </CardContent>

                {footer && (
                    <CardFooter className="
            px-4 text-sm border-t 
            text-gray-500 dark:text-gray-400 
            border-gray-200 dark:border-gray-700
        ">
                        {footer}
                    </CardFooter>
                )}
            </Card>


        )
    }

export default CardTemplete