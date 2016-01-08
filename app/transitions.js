export default function() {
    this.transition(
        this.fromRoute('user.index'),
        this.toRoute('user.info'),
        this.use('toUp')
    );
    this.transition(
        this.fromRoute('user.info'),
        this.toRoute('user.done'),
        this.use('toUp')
    );
}
