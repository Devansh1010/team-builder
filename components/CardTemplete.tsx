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
                className="w-[250px] h-full max-w-md mx-auto 
                 shadow-md rounded-lg border border-gray-700 
                 bg-gray-800 transition-transform duration-200 
                 hover:shadow-lg hover:-translate-y-1 hover:border-blue-500 cursor-pointer"
            >
                <CardHeader className="flex justify-between items-center px-4">
                    <div>
                        <CardTitle className="text-2xl font-semibold">
                            {title}
                        </CardTitle>
                        {description && (
                            <CardDescription className="text-gray-400 text-sm">
                                {description}
                            </CardDescription>
                        )}
                    </div>
                    {icon && (
                        <div>
                            <CardAction className=" hover:text-blue-300 transition-colors">
                                {icon}
                            </CardAction>
                        </div>
                    )}
                </CardHeader>

                <CardContent className="px-4 text-3xl font-bold text-white">
                    {content}
                </CardContent>

                {
                    footer && (
                        <div>
                            <CardFooter className="px-4 text-gray-400 text-sm border-t border-gray-700">
                                {footer}
                            </CardFooter>
                        </div>
                    )
                }
            </Card>

        )
    }

export default CardTemplete