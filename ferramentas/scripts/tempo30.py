"""Funcao unica de tempo do fluxo animador: segundos <-> frames, a 30 fps.
Toda conversao de tempo para frame passa por aqui."""
FPS = 30


def frames(t):
    """Segundos -> numero inteiro de frames (arredondado)."""
    return int(round(t * FPS))


def segundos(f):
    """Frames -> segundos."""
    return f / FPS


def quadro(t):
    """Segundos -> segundos encaixados no frame mais proximo."""
    return round(frames(t) / FPS, 3)
