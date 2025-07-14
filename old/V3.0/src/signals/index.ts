/*

SignalEvent          ( no value )
^ ROSignal           ( value  R+abstract )
    ^ IndirectSignal ~> WithSource ( source R/W ) [doesn't trigger if value wasn't read or this.ack()]
        ^ Signal             ( value  R/W )
        ^ LazyComputedSignal ( compute R/W ) [compute value on demand + cache value]
    ^ PrioritySignal
    ^ ParsedSignal (like LCS) (why not LCS or IS ?) <~ rework ?
*/