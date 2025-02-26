/*

SignalEvent          ( no value )
^ ROSignal           ( value  R+abstract )
    ^ IndirectSignal ( source R/W ) [doesn't trigger if value wasn't read or this.ack()]
        ^ Signal     ( value  R/W )
        ^ LazyComputedSignal ( compute R/W ) [compute value on demand + cache value]
    ^ PrioritySignal
*/