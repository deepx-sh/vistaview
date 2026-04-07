import React from 'react'
import { RefreshCw, AlertTriangle, Home } from 'lucide-react'

class ErrorBoundary extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            hasError:false,
            error: null,
            errorInfo:null
        }
    }

    static getDerivedStateFromError(error) {
        return {hasError:true,error}
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo })
        
        if (import.meta.env.DEV) {
            error("ErrorBoundary caught: ",error,errorInfo)
        }
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo:null
        })
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback({
                    error: this.state.error,
                    reset:this.handleReset
                })
            }

            return (
                <DefaultErrorFallback
                    error={this.state.error}
                    errorInfo={this.state.errorInfo}
                    onReset={this.handleReset}
                    onGoHome={() => {
                        this.handleReset()
                        window.location.href="/"
                    }}
                />
            )
        }
        return this.props.children
    }
}


const DefaultErrorFallback = ({ error, errorInfo, onReset, onGoHome }) => {
    const isDev = import.meta.env.DEV;
    return (
        <div className='min-h-screen bg-background flex items-center justify-center px-4'>
            <div className='max-w-md w-full text-center'>
                <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                    <AlertTriangle size={32} className='text-danger'/>
                </div>

                <h1 className='text-2xl font-semibold text-text-primary mb-2'>
                    Something went wrong
                </h1>

                <p className='text-text-secondary text-sm mb-8'>
                    An unexpected error occurred. You can try refreshing the page or go back to the home page
                </p>

                <div className='flex flex-col sm:flex-row gap-3 justify-center mb-8'>
                    <button onClick={onReset} className='flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer'>
                        <RefreshCw size={16} />
                        Try again
                    </button>

                    <button onClick={onGoHome} className='flex items-center justify-center gap-2 border border-border hover:bg-surface text-text-secondary px-6 py-2.5 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer'>
                        <Home size={16} />
                        Go to home
                    </button>
                </div>

                {isDev && error && (
                    <details className='text-left bg-red-50 border border-red-200 rounded-lg p-4'>
                        <summary className='text-sm font-medium text-red-700 cursor-pointer mb-2'>
                            Error details (dev only)
                        </summary>

                        <p className='text-xs font-mono text-red-600 mb-3 wrap-break-word'>
                            {error.toString()}
                        </p>

                        {errorInfo?.componentStack && (
                            <pre className='text-xs text-red-500 overflow-auto max-h-48 whitespace-pre-wrap'>
                                {errorInfo.componentStack}
                            </pre>
                        )}
                    </details>
                )}
            </div>
        </div>
    )
};

export default ErrorBoundary